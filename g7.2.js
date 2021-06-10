const urlParams = new URLSearchParams(window.location.search);
const debug = urlParams.get('debug') !== null
const showReference = false

var state;

function rnd(a) {
  r = a[Math.floor(Math.random() * a.length)]
  if (showReference) {
    return r
  } else {
    return r[1]
  }
}

function display() {
  var msg_e = '?'
  var msg_d = '?'
  var info = ''

  var points = "0,0 0,0 0,0"

  if (state.turn % 2 == 0) {
    points = "100,0 300,0 150,150"
    who = 'Samir'
    msg_e = rnd(data[state.level]['samir_e'])
    msg_d = rnd(data[state.level]['samir_d'])
  } else {
    points = "333,0 433,0 383,150"
    who = 'Nathan'
    msg_e = rnd(data[state.level]['nathan_e'])
    msg_d = rnd(data[state.level]['nathan_d'])
  }

  if (state.turn == 0) {
    info = data[state.level].start
    points = "0,0 0,0 0,0"
    if (state.level == 0) {
      points = "100,0 300,0 150,150"
    }
  }

  if (state.plus > 0) {
    text = msg_e
  }
  else if (state.minus > 0) {
    text = msg_d
  } else {
    text = info
  }

  var bottom = ""
  if (state.plus == 5 && state.level != 2) {
    bottom = `<div class="g7text" style="float: left; position: absolute; left: 0px; bottom: 0px; z-index: 1000;width: 523px; background-color: #c0c0c0c0; padding: 5px; color: #000000; font-weight: bold; text-align:center">${data[state.level]['up']}</div>`
  }
  if (state.cool == 1) {
    state.cool = 0
    bottom = `<div class="g7text" style="float: left; position: absolute; left: 0px; bottom: 0px; z-index: 1000;width: 523px; background-color: #c0c0c0c0; padding: 5px; color: #000000; font-weight: bold; text-align:center">${data[state.level]['down']}</div>`
  }

  var html = `
  <table style="table-layout:fixed;">
  <tr><td colspan="2">
    <div class="g7container" style="border: 1px solid #DDDDDD; width: 533px; height: 400px; position: relative;">
      <div class="g7text" style="float: left; position: absolute; left: 0px; top: 0px; z-index: 1000;width: 523px; background-color: #c0c0c0; padding: 5px; color: #000000; text-align:center">${text}</div>
      <img id="g7img" src="https://ikarus.snowmon.ch/wp-content/uploads/2021/05/level${state.level+1}.png" style="float:left;position:aboslute;left:0px;top:0px;z-index: 1000;color:#92AD40"/>
      ${bottom}
      <svg viewBox="0 0 533 400" style="float: left; position: absolute; left: 0px; top: 0px; z-index: 500">
        <polygon points="${points}" fill="#c0c0c0"/>
      </svg>
    </div>
  </td></tr>
  <tr><td style="max-width:50%;width:50%;"><button onclick="plus()">▲</button></td><td style="max-width:50%;width:50%;"><button style="float: right" onclick="minus()">▼</button></td></tr>
  </table>
  `;

  if (state.win) {
    html =
    `
    <table style="table-layout:fixed;">
    <tr><td colspan="2">
    <div class="g7container" style="border: 1px solid #DDDDDD; width: 533px; height: 400px; position: relative;">
      <div class="g7text" style="float: left; position: absolute; left: 0px; top: 0px; z-index: 1000; background-color: #d0d0d0; padding: 5px; color: #000000; font-weight: bold; text-align:center">Der Konflikt ist beigelegt. Samir und Nathan haben sich versöhnt.</div>
      <img id="g7img" src="https://ikarus.snowmon.ch/wp-content/uploads/2021/05/win.png" style="float:left;position:aboslute;left:0px;top:0px;z-index: 1000;color:#92AD40"/>
    </div>
    </td></tr>
    <tr><td><center><button onclick="game()">Wiederholen</button></center></td></td></tr>
    </table>
    `
  }

  if (state.lost) {
    html =
    `
    <table style="table-layout:fixed;">
    <tr><td colspan="2">
    <div class="g7container" style="border: 1px solid #DDDDDD; width: 533px; height: 400px; position: relative;">
      <div class="g7text" style="float: left; position: absolute; left: 0px; top: 0px; z-index: 1000; background-color: #d0d0d0; padding: 5px; color: #000000; font-weight: bold; text-align:center">Der Konflikt endet vor Gericht. Samir und Nathan sind keine Freunde mehr.</div>
      <img id="g7img" src="https://ikarus.snowmon.ch/wp-content/uploads/2021/05/lost.png" style="float:left;position:aboslute;left:0px;top:0px;z-index: 1000;color:#92AD40"/>
    </div>
    </td></tr>
    <tr><td><center><button onclick="game()">Wiederholen</button></center></td></td></tr>
    </table>
    `
  }
  var x = {}
  x.html = html
  x.who = who
  if (state.plus > 0) {
    x.text = msg_e
  }
  else if (state.minus > 0) {
    x.text = msg_d
  } else {
    x.text = info
  }
  return x;
}

function game() {
  state = {
    'turn' : 0,
    'level' : 0,
    'plus' : 0,
    'minus' : 0,
  }
  update()
}

function update() {
  if (state.plus > 5) {
    if (state.level < 2) {
      state.level++
      state.turn = 0
      state.plus = 0
      state.minus = 0
    } else {
      state.lost = true
    }
  }
  if (state.minus >= 3) {
    if (state.level >= 1) {
      state.level--
      state.turn = 0
      state.plus = 0
      state.minus = 0
      state.cool = 1
    } else {
      state.win = true
    }
  }

  result = display()
  document.getElementById("game-g7-2").innerHTML = result.html;
  document.getElementById("debug-g7-2").innerHTML = display_debug();
  if (!debug) {
    document.getElementById("debug-g7-2").style.display = "none"
  }
  state.turn++
}

function display_debug() {
  return (JSON.stringify(state, undefined, 2) +
  '<br/>' +
  JSON.stringify(data, undefined, 2) )
}

function plus() {
  state.plus++
  state.minus = 0
  update()
}

function minus() {
  state.minus++
  state.plus = 0
  update()
}

var data =
[
  {
    'start':"Mich stört, dass du das Geheimnis, das ich dir anvertraut habe, weitererzählt hast.",
    'up':"Achtung! Der Konflikt überschreitet die Eskalationsstufe, auf der Selbsthilfe und eine win-win-Lösung noch möglich sind.",
    'down':"Bravo! Nathan und Samir haben mit Sandras Hilfe zurückgefunden auf eine Stufe, auf der sie ihren Konflikt selbst lösen können und eine win-win-Lösung möglich ist.",
    'samir_e': [
     ["1-3a","Immer erzählst du meine privaten Angelegenheiten weiter!"],
     ["1-5a","Du bist kein guter Freund, wenn du so mit mir umgehst."],
     ["1-7a","Du machst mir alles kaputt, was mir wichtig ist."],
     ["1-9a","Ich finde es schrecklich, dass du so eine Schwatzbase bist."],
     ["1-11a","Du bist so ein blödes Plappermaul!"],
     ["1-x", "Nun sei doch nicht so empfindlich!"],
     ["1-x", "Nie nimmst du auf meine Bedürfnisse Rücksicht!"],
     ["1-x", "Du denkst immer nur an dich."],
     ["1-x", "Ich an deiner Stelle wäre einfühlsam. "],
     ["1-x", "Mein Gott, man wird doch noch etwas sagen dürfen. "],
     ["1-x", "Das kannst du nicht verstehen."],
     ["1-x", "Du mischst dich in Dinge ein, die dich nichts angehen. "],
     ["1-x", "Du verstehst mich nicht. "],
     ["1-x", "Aha, jetzt bin wieder ich der Schuldige!"],
     ["1-x", "Der Kluge gibt nach, der Esel bleibt stehen."],
     ["1-x", "Lass mich gefälligst mal ausreden. "],
     ["1-x", "Du musst nicht meinen, nur weil du studiert hast, kannst du so mit mir reden. "],
    ],
    'nathan_e': [
     ["1-2a","Ist doch nicht so schlimm. Ich habe es nur Lydia erzählt. Und die behält es für sich."],
     ["1-4a","Du übertreibst ja völlig. Nun mach doch wegen dieser Kleinigkeit kein so grosses Drama."],
     ["1-6a","Du hast auch schon Dinge über mich weitererzählt, eigentlich bist du Derjenige, der immer rumschwätzt, und wenn ich einmal dasselbe mache, regst du dich auf."],
     ["1-8a","Reg dich ab, Alter! Ich hab’s ja nur Lydia erzählt."],
     ["1-10a","Immer machst du aus jeder Kleinigkeit ein Riesentheater!"],
     ["1-x", "Nun sei doch nicht so empfindlich!"],
     ["1-x", "Nie nimmst du auf meine Bedürfnisse Rücksicht!"],
     ["1-x", "Du denkst immer nur an dich."],
     ["1-x", "Ich an deiner Stelle wäre einfühlsam. "],
     ["1-x", "Mein Gott, man wird doch noch etwas sagen dürfen. "],
     ["1-x", "Das kannst du nicht verstehen."],
     ["1-x", "Du mischst dich in Dinge ein, die dich nichts angehen. "],
     ["1-x", "Du verstehst mich nicht. "],
     ["1-x", "Aha, jetzt bin wieder ich der Schuldige!"],
     ["1-x", "Der Kluge gibt nach, der Esel bleibt stehen."],
     ["1-x", "Lass mich gefälligst mal ausreden. "],
     ["1-x", "Du musst nicht meinen, nur weil du studiert hast, kannst du so mit mir reden. "],
    ],
    'samir_d': [
     ["1-3b","Vielleicht habe ich zu wenig deutlich gesagt, dass du das für dich behalten sollst."],
     ["1-5b","Hast du Ideen, wie wir den Schaden jetzt begrenzen können, bevor es alle erfahren?"],
     ["1-7b","Warum hast du das Lydia erzählt? Denkst du Lydia wird sorgfältig damit umgehen?"],
     ["1-9b","Kannst du denn verstehen, dass ich jetzt enttäuscht bin?"],
     ["1-11b","Kannst du irgendetwas machen, damit Lydia die Geschichte für sich behält?"],
     ["1-x","Ich höre dir mal fünf Minuten zu, ohne gleich zu reagieren. Und danach machst du dasselbe. Okay?"],
     ["1-x","Ich möchte gerne verstehen, was in dir vorgeht. Erkläre es mir bitte. "],
     ["1-x","Kannst du mir schildern, was genau passiert ist?"],
     ["1-x","Ich verstehe nicht ganz, warum du so wütend bist. Kannst du mir das erklären?"],
     ["1-x","Was kann ich dazu beitragen, dass wir die Geschichte lösen können?"],
     ["1-x","Hast du einen Vorschlag, wie wir das nun regeln könnten?"],
     ["1-x","Ich glaube, es ist Zeit, dass wir mal wieder ausführlich miteinander reden. "],
     ["1-x","Wollen wir uns in die Gartenbeiz setzen und darüber reden? "],
     ["1-x","Hat dich dieses Geheimnis traurig gemacht? "],
     ["1-x","Hast du jetzt Zeit, um darüber zu reden, oder kommst du morgen zum Nachtessen und wir besprechen alles?"],
    ],
    'nathan_d': [
     ["1-2b","Ich wusste nicht, dass dies ein Geheimnis ist. Ich dachte, alle wüssten Bescheid."],
     ["1-4b","Das tut mir leid. Wie kann ich das wieder gutmachen?"],
     ["1-6b","Ich kann gut verstehen, dass dich dies verletzt. Ich möchte gerne ein Freund sein, dem du Dinge anvertrauen kannst."],
     ["1-8b","Das ist jetzt nicht wirklich eine Rechtfertigung, ich weiss, aber ich war an dem Abend ziemlich betrunken, als ich es Lydia erzählte. Ich wollte ihr ein wenig Eindruck machen."],
     ["1-10b","Es tut mir wirklich leid. Ich möchte dich um Entschuldigung bitten."],
     ["1-x","Ich höre dir mal fünf Minuten zu, ohne gleich zu reagieren. Und danach machst du dasselbe. Okay?"],
     ["1-x","Ich möchte gerne verstehen, was in dir vorgeht. Erkläre es mir bitte. "],
     ["1-x","Kannst du mir schildern, was genau passiert ist?"],
     ["1-x","Ich verstehe nicht ganz, warum du so wütend bist. Kannst du mir das erklären?"],
     ["1-x","Was kann ich dazu beitragen, dass wir die Geschichte lösen können?"],
     ["1-x","Hast du einen Vorschlag, wie wir das nun regeln könnten?"],
     ["1-x","Ich glaube, es ist Zeit, dass wir mal wieder ausführlich miteinander reden. "],
     ["1-x","Wollen wir uns in die Gartenbeiz setzen und darüber reden? "],
     ["1-x","Hat dich dieses Geheimnis traurig gemacht? "],
     ["1-x","Hast du jetzt Zeit, um darüber zu reden, oder kommst du morgen zum Nachtessen und wir besprechen alles?"],
    ],
  },
  {
    'start':"Sandra: Hey, ihr beiden, das klingt ja heftig, wie ihr miteinander redet. Wollen wir uns mal hinsetzen und zusammen die Sache zu klären versuchen?",
    'up':"Achtung. Der Konflikt überschreitet die Stufe, auf der mit Hilfe einer wohlwollenden Drittperson eine Lösung gefunden werden kann. Es braucht jetzt  einen Machteingriff und wird bald nur noch Verlierer geben.",
    'down':"Bravo! Nathan und Samir haben zurückgefunden auf eine Stufe, auf der sie den Konflikt mit Hilfe einer wohlwollenden Drittperson lösen können.",
    'samir_e': [
      ["2-5a","Weisst du was: Du kannst dir die Sommerferien in meinem Haus am Meer abschreiben! "],
      ["2-7a","Jetzt wirst du mich richtig kennen lernen. Ich kann nämlich Karate!"],
      ["2-9a","Jetzt weiss ich endlich, wer du wirklich bist. Ich habe dich für einen Freund gehalten, dabei hast du mich immer nur ausgenutzt.  "],
      ["2-11a","Ich hau dir gleich eine in die Fresse, du Arschloch! "],
      ["2-2a","Was mischst du dich denn ein? "],
      ["2-3a","Kümmere dich um deine eigenen Angelegenheiten. "],
      ["2-4a","Mit diesem Verräter hier rede ich sowieso kein einziges Wort mehr. "],
      ["2-x", "Denkst du eigentlich nie darüber nach, was du bei anderen anrichtest? "],
      ["2-x", "Du willst dich doch nur wichtigmachen.  "],
      ["2-x", "Mit so einem wie dir will ich nichts mehr zu tun haben!"],
      ["2-x", "Du Egoist! "],
      ["2-x", "Wenn du das noch einmal zu mir sagst, erzähle ich im Büro, was du für einer bist!"],
      ["2-x", "Na warte, du kannst mich schon noch kennenlernen!"],
      ["2-x", "Ich sag dir eines: Du bist schuld, an allem, was jetzt kommt. "],
      ["2-x", "Du Sandra, du findest doch auch, dass ich Recht habe?"],
      ["2-x", "Ich hätte nicht gedacht, was du für ein Idiot bist. "],
      ["2-x", "Und sowas habe ich für meinen Freund gehalten. "],
      ["2-x", "Lukas und Dominik haben auch gesagt, dass man dir nicht vertrauen kann. "],
      ["2-x", "Das nimmst du zurück, aber sofort, sonst…!"],
      ["2-x", "Dir fehlt doch jegliche Empathie. "],
      ["2-x", "Narzist!"],
      ["2-x", "Jetzt weiss ich, was Lydia meinte, als sie sagte, du seist falsch. "],
      ["2-x", "Ich kenne eine, die kann Voodoo-Puppen herstellen, warte nur! "],
      ["2-x", "Oh, wäre ich nur nie auf dein schleimiges Lachen hereingefallen. "],
      ["2-x", "Entweder du entschuldigst dich jetzt auf der Stelle, oder…!"],
      ["2-x", "Ich habe dir so viel geholfen und anstatt dankbar zu sein, greifst du mich an. "],
      ["2-x", "Du bist sowas von unfair. "],
    ],
    'nathan_e': [
      ["2-6a","Und weisst du was: Du brauchst nie mehr meinen Wagen auszuleihen. "],
      ["2-8a","Ich werde dein schmutziges Geheimnis nun überall rumerzählen, damit alle sehen, was du für einer bist! "],
      ["2-10a","Sowas wie dich sollte man auf den Mülleimer der Geschichte werfen. "],
      ["2-2a","Was mischst du dich denn ein? "],
      ["2-3a","Kümmere dich um deine eigenen Angelegenheiten. "],
      ["2-4a","Mit diesem Verräter hier rede ich sowieso kein einziges Wort mehr. "],
      ["2-x", "Denkst du eigentlich nie darüber nach, was du bei anderen anrichtest? "],
      ["2-x", "Du willst dich doch nur wichtigmachen.  "],
      ["2-x", "Mit so einem wie dir will ich nichts mehr zu tun haben!"],
      ["2-x", "Du Egoist! "],
      ["2-x", "Wenn du das noch einmal zu mir sagst, erzähle ich im Büro, was du für einer bist!"],
      ["2-x", "Na warte, du kannst mich schon noch kennenlernen!"],
      ["2-x", "Ich sag dir eines: Du bist schuld, an allem, was jetzt kommt. "],
      ["2-x", "Du Sandra, du findest doch auch, dass ich Recht habe?"],
      ["2-x", "Ich hätte nicht gedacht, was du für ein Idiot bist. "],
      ["2-x", "Und sowas habe ich für meinen Freund gehalten. "],
      ["2-x", "Lukas und Dominik haben auch gesagt, dass man dir nicht vertrauen kann. "],
      ["2-x", "Das nimmst du zurück, aber sofort, sonst…!"],
      ["2-x", "Dir fehlt doch jegliche Empathie. "],
      ["2-x", "Narzist!"],
      ["2-x", "Jetzt weiss ich, was Lydia meinte, als sie sagte, du seist falsch. "],
      ["2-x", "Ich kenne eine, die kann Voodoo-Puppen herstellen, warte nur! "],
      ["2-x", "Oh, wäre ich nur nie auf dein schleimiges Lachen hereingefallen. "],
      ["2-x", "Entweder du entschuldigst dich jetzt auf der Stelle, oder…!"],
      ["2-x", "Ich habe dir so viel geholfen und anstatt dankbar zu sein, greifst du mich an. "],
      ["2-x", "Du bist sowas von unfair. "],
    ],
    'samir_d': [
      ["2-2b","Danke, dass du uns helfen willst. Allein kommen wir hier grad nicht mehr weiter. "],
      ["2-3b","Ich möchte gerne wieder Frieden mit Nathan, aber ich bin grad so enttäuscht von ihm. "],
      ["2-4b","Also setzen wir uns da drüben auf die Bank und reden miteinander"],
      ["2-x","Danke Sandra für deine Hilfe."],
      ["2-x","Weisst du Sandra, diese Freundschaft ist mir eigentlich sehr wichtig. "],
      ["2-x","Ich reagiere grad so heftig, weil du mir eigentlich ganz wichtig bist. "],
      ["2-x","Wir haben doch so viel Schönes zusammen erlebt."],
      ["2-x","Ist es für dich okay, wenn wir Sandra alles erzählen?"],
      ["2-x","Ich möchte gerne dazu beitragen, dass wir eine Lösung finden, die für beide stimmt. "],
      ["2-x","Es tut mir leid, wenn ich dich verletzt habe. "],
      ["2-x","Entschuldige, ich wollte das nicht so sagen."],
      ["2-x","Wir sind beide grad sehr erhitzt. "],
      ["2-x","Vielleicht sollten wir darüber reden, wenn wir ein bisschen Distanz dazu haben? "],
      ["2-x","Ich würde dir gerne erklären, warum das für mich so wichtig ist."],
      ["2-x","Ich habe gerade ein bisschen sehr heftig reagiert. "],
      ["2-x","Du warst für mich immer ein Vorbild, weil du so aufrichtig bist. "],
    ],
    'nathan_d': [
      ["2-2b","Danke, dass du uns helfen willst. Allein kommen wir hier grad nicht mehr weiter. "],
      ["2-3b","Ich möchte gerne wieder Frieden mit Nathan, aber ich bin grad so enttäuscht von ihm. "],
      ["2-4b","Also setzen wir uns da drüben auf die Bank und reden miteinander"],
      ["2-x","Danke Sandra für deine Hilfe."],
      ["2-x","Weisst du Sandra, diese Freundschaft ist mir eigentlich sehr wichtig. "],
      ["2-x","Ich reagiere grad so heftig, weil du mir eigentlich ganz wichtig bist. "],
      ["2-x","Wir haben doch so viel Schönes zusammen erlebt."],
      ["2-x","Ist es für dich okay, wenn wir Sandra alles erzählen?"],
      ["2-x","Ich möchte gerne dazu beitragen, dass wir eine Lösung finden, die für beide stimmt. "],
      ["2-x","Es tut mir leid, wenn ich dich verletzt habe. "],
      ["2-x","Entschuldige, ich wollte das nicht so sagen."],
      ["2-x","Wir sind beide grad sehr erhitzt. "],
      ["2-x","Vielleicht sollten wir darüber reden, wenn wir ein bisschen Distanz dazu haben? "],
      ["2-x","Ich würde dir gerne erklären, warum das für mich so wichtig ist."],
      ["2-x","Ich habe gerade ein bisschen sehr heftig reagiert. "],
      ["2-x","Du warst für mich immer ein Vorbild, weil du so aufrichtig bist. "],
    ],
  },
  {
    'start':"Polizistin: Sofort aufhören, ihr beiden! Auseinander! Sofort! Beruhigen Sie sich! Wollen Sie Anzeige erstatten und die Sache vor Gericht klären?  ",
    'samir_e': [
      ["3-6a","Schau, was ich mit deinem Handy mache: ich werfe es zum Fenster raus!"],
      ["3-8a","Nimm das, das und DAS!"],
      ["3-2a","Hau ab, du Saubulle! "],
      ["3-3a","Bullen sind Nullen! "],
      ["3-4a","Weg mit der Schmier!"],
      ["3-x","Nein! Aus! Schluss! Ich will nichts mehr hören!"],
      ["3-x","Nie mehr werde ich dich auch nur mit meinem Hintern grüssen. "],
      ["3-x","Meinem schlimmsten Feind würde ich nicht wünschen, was ich dir jetzt wünsche."],
      ["3-x","Ich hasse dich!"],
      ["3-x","Du wirst keine ruhige Minute mehr haben, das schwör’ ich dir!"],
      ["3-x","Du glaubst ja wohl nicht, dass ich dir unter diesen Umständen das Auto zurückgeben werde."],
      ["3-x","Polizei! Schauen Sie mal nach, der hat bestimmt wieder Cannabis in der Tasche."],
      ["3-x","Ich will Anzeige erstatten, der hat mich bedroht. "],
    ],
    'nathan_e': [
      ["3-5a","Ich ruf jetzt gleich deine Freundin an und sage ihr, was sie für eine Schlampe ist! "],
      ["3-7a","Hier kannst du meine Faust in deine Fresse haben."],
      ["3-2a","Hau ab, du Saubulle! "],
      ["3-3a","Bullen sind Nullen! "],
      ["3-4a","Weg mit der Schmier!"],
      ["3-x","Nein! Aus! Schluss! Ich will nichts mehr hören!"],
      ["3-x","Nie mehr werde ich dich auch nur mit meinem Hintern grüssen. "],
      ["3-x","Meinem schlimmsten Feind würde ich nicht wünschen, was ich dir jetzt wünsche."],
      ["3-x","Ich hasse dich!"],
      ["3-x","Du wirst keine ruhige Minute mehr haben, das schwör’ ich dir!"],
      ["3-x","Du glaubst ja wohl nicht, dass ich dir unter diesen Umständen das Auto zurückgeben werde."],
      ["3-x","Polizei! Schauen Sie mal nach, der hat bestimmt wieder Cannabis in der Tasche."],
      ["3-x","Ich will Anzeige erstatten, der hat mich bedroht. "],
    ],
    'samir_d': [
      ["3-2b","Ich glaub, jetzt sind wir wirklich zu weit gegangen."],
      ["3-3b","Entschuldigen Sie Herr Polizist, mein Freund und ich haben Streit und sind gerade ganz aufgebracht. Wir wollten Sie nicht beleidigen. "],
      ["3-4b","Wir werden versuchen, unseren Konflikt anständig zu klären. "],
      ["3-x","Komm, wir klären das wie erwachsene Menschen ohne Polizei. "],
      ["3-x","Lass uns diese Geschichte friedlich miteinander regeln."],
      ["3-x","Was brauchst du denn jetzt von mir, damit wir ruhig miteinander reden können?"],
      ["3-x","Ich möchte nicht, dass unsere Freundschaft vor Gericht endet."],
      ["3-x","Das kann doch nicht sein, dass wir Feinde geworden sind. "],
      ["3-x","Lass uns mit diesen Beschimpfungen aufhören. "],
      ["3-x","Wollen wir nicht lieber Sandras Angebot annehmen?"],
      ["3-x","Ich habe das alles nicht so gemeint. Du bist doch mein Freund!"],
      ["3-x","Lass uns darüber reden, wie wir es in Zukunft besser machen können."],
      ["3-x","Entschuldigt bitte meine heftige Reaktion. "],
      ["3-x","Das tut mir alles sehr leid. "],
      ["3-x","Es tut mir leid, dass ich dich verletzt habe, das wollte ich nicht. "],
    ],
    'nathan_d': [
      ["3-2b","Ich glaub, jetzt sind wir wirklich zu weit gegangen."],
      ["3-3b","Entschuldigen Sie Herr Polizist, mein Freund und ich haben Streit und sind gerade ganz aufgebracht. Wir wollten Sie nicht beleidigen. "],
      ["3-4b","Wir werden versuchen, unseren Konflikt anständig zu klären. "],
      ["3-x","Komm, wir klären das wie erwachsene Menschen ohne Polizei. "],
      ["3-x","Lass uns diese Geschichte friedlich miteinander regeln."],
      ["3-x","Was brauchst du denn jetzt von mir, damit wir ruhig miteinander reden können?"],
      ["3-x","Ich möchte nicht, dass unsere Freundschaft vor Gericht endet."],
      ["3-x","Das kann doch nicht sein, dass wir Feinde geworden sind. "],
      ["3-x","Lass uns mit diesen Beschimpfungen aufhören. "],
      ["3-x","Wollen wir nicht lieber Sandras Angebot annehmen?"],
      ["3-x","Ich habe das alles nicht so gemeint. Du bist doch mein Freund!"],
      ["3-x","Lass uns darüber reden, wie wir es in Zukunft besser machen können."],
      ["3-x","Entschuldigt bitte meine heftige Reaktion. "],
      ["3-x","Das tut mir alles sehr leid. "],
      ["3-x","Es tut mir leid, dass ich dich verletzt habe, das wollte ich nicht. "],
    ],
  }
];
