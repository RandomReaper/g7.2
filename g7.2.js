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

  if (state.turn == 0) {
    info = data[state.level].start
  }

  if (state.turn % 2 == 0) {
    who = 'Samir'
    msg_e = rnd(data[state.level]['samir_e'])
    msg_d = rnd(data[state.level]['samir_d'])
  } else {
    who = 'Nathan'
    msg_e = rnd(data[state.level]['nathan_e'])
    msg_d = rnd(data[state.level]['nathan_d'])
  }

  if (state.plus > 0) {
    text = who + ": " + msg_e
  }
  else if (state.minus > 0) {
    text = who + ": " + msg_d
  } else {
    text = info
  }

  if (state.plus == 5) {
    text = text + '<br/><i>Achtung!</i> Der Konflikt überschreitet die Eskalationsstufe, auf der Selbsthilfe und eine win-win-Lösung noch möglich sind.'
  }

  var html = `
  <table style="table-layout:fixed;">
  <tr><td colspan="2">
    <div class="g7container" style="border: 1px solid #DDDDDD; width: 533px; height: 400px; position: relative;">
      <div class="g7text" style="float: left; position: absolute; left: 0px; top: 0px; z-index: 1000; background-color: #d0d0d0; padding: 5px; color: #000000; font-weight: bold; text-align:center">${text}</div>
      <img id="g7img" src="https://ikarus.snowmon.ch/wp-content/uploads/2021/05/level${state.level+1}.png" style="float:left;position:aboslute;left:0px;top:0px;z-index: 1000;color:#92AD40"/>
    </div>
  </td></tr>
  <tr><td style="max-width:50%;width:50%;"><button onclick="plus()">▲</button></td><td style="max-width:50%;width:50%;"><button onclick="minus()">▼</button></td></tr>
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
    <tr><td colspan="2"><button onclick="game()">Wiederhollen</button></td></tr>
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
    <tr><td colspan="2"><button onclick="game()">Wiederhollen</button></td></tr>
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
    'start':"Samir: Mich stört, dass du das Geheimnis, das ich dir anvertraut habe, weitererzählt hast.",
    'samir_e': [
     ["1-3a","Immer erzählst du meine privaten Angelegenheiten weiter!"],
     ["1-5a","Du bist kein guter Freund, wenn du so mit mir umgehst."],
     ["1-7a","Du machst mir alles kaputt, was mir wichtig ist."],
     ["1-9a","Ich finde es schrecklich, dass du so eine Schwatzbase bist."],
     ["1-11a","Du bist so ein blödes Plappermaul!"],
    ],
    'nathan_e': [
     ["1-2a","Ist doch nicht so schlimm. Ich habe es nur Lydia erzählt. Und die behält es für sich."],
     ["1-4a","Du übertreibst ja völlig. Nun mach doch wegen dieser Kleinigkeit kein so grosses Drama."],
     ["1-6a","Du hast auch schon Dinge über mich weitererzählt, eigentlich bist du Derjenige, der immer rumschwätzt, und wenn ich einmal dasselbe mache, regst du dich auf."],
     ["1-8a","Reg dich ab, Alter! Ich hab’s ja nur Lydia erzählt."],
     ["1-10a","Immer machst du aus jeder Kleinigkeit ein Riesentheater!"],
    ],
    'samir_d': [
     ["1-3b","Vielleicht habe ich zu wenig deutlich gesagt, dass du das für dich behalten sollst."],
     ["1-5b","Hast du Ideen, wie wir den Schaden jetzt begrenzen können, bevor es alle erfahren?"],
     ["1-7b","Warum hast du das Lydia erzählt? Denkst du Lydia wird sorgfältig damit umgehen?"],
     ["1-9b","Kannst du denn verstehen, dass ich jetzt enttäuscht bin?"],
     ["1-11b","Kannst du irgendetwas machen, damit Lydia die Geschichte für sich behält?"],
    ],
    'nathan_d': [
     ["1-2b","Ich wusste nicht, dass dies ein Geheimnis ist. Ich dachte, alle wüssten Bescheid."],
     ["1-4b","Das tut mir leid. Wie kann ich das wieder gutmachen?"],
     ["1-6b","Ich kann gut verstehen, dass dich dies verletzt. Ich möchte gerne ein Freund sein, dem du Dinge anvertrauen kannst."],
     ["1-8b","Das ist jetzt nicht wirklich eine Rechtfertigung, ich weiss, aber ich war an dem Abend ziemlich betrunken, als ich es Lydia erzählte. Ich wollte ihr ein wenig Eindruck machen."],
     ["1-10b","Es tut mir wirklich leid. Ich möchte dich um Entschuldigung bitten."],
    ],
  },
  {
    'start':"Drittperson: Hey, ihr beiden, das klingt ja heftig, wie ihr miteinander redet. Wollen wir uns mal hinsetzen und zusammen die Sache zu klären versuchen?",
    'samir_e': [
      ["2-5a","Weisst du was: Du kannst dir die Sommerferien in meinem Haus am Meer abschreiben! "],
      ["2-7a","Jetzt wirst du mich richtig kennen lernen. Ich kann nämlich Karate!"],
      ["2-9a","Jetzt weiss ich endlich, wer du wirklich bist. Ich habe dich für einen Freund gehalten, dabei hast du mich immer nur ausgenutzt.  "],
      ["2-11a","Ich hau dir gleich eine in die Fresse, du Arschloch! "],
      ["2-2a","Was mischst du dich denn ein? "],
      ["2-3a","Kümmere dich um deine eigenen Angelegenheiten. "],
      ["2-4a","Mit diesem Verräter hier rede ich sowieso kein einziges Wort mehr. "],
    ],
    'nathan_e': [
      ["2-6a","Und weisst du was: Du brauchst nie mehr meinen Wagen auszuleihen. "],
      ["2-8a","Ich werde dein schmutziges Geheimnis nun überall rumerzählen, damit alle sehen, was du für einer bist! "],
      ["2-10a","Sowas wie dich sollte man auf den Mülleimer der Geschichte werfen. "],
      ["2-2a","Was mischst du dich denn ein? "],
      ["2-3a","Kümmere dich um deine eigenen Angelegenheiten. "],
      ["2-4a","Mit diesem Verräter hier rede ich sowieso kein einziges Wort mehr. "],
    ],
    'samir_d': [
      ["2-2b","Danke, dass du uns helfen willst. Allein kommen wir hier grad nicht mehr weiter. "],
      ["2-3b","Ich möchte gerne wieder Frieden mit Nathan, aber ich bin grad so enttäuscht von ihm. "],
      ["2-4b","Also setzen wir uns da drüben auf die Bank und reden miteinander"],
    ],
    'nathan_d': [
      ["2-2b","Danke, dass du uns helfen willst. Allein kommen wir hier grad nicht mehr weiter. "],
      ["2-3b","Ich möchte gerne wieder Frieden mit Nathan, aber ich bin grad so enttäuscht von ihm. "],
      ["2-4b","Also setzen wir uns da drüben auf die Bank und reden miteinander"],
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
    ],
    'nathan_e': [
      ["3-5a","Ich ruf jetzt gleich deine Freundin an und sage ihr, was sie für eine Schlampe ist! "],
      ["3-7a","Hier kannst du meine Faust in deine Fresse haben."],
      ["3-2a","Hau ab, du Saubulle! "],
      ["3-3a","Bullen sind Nullen! "],
      ["3-4a","Weg mit der Schmier!"],
    ],
    'samir_d': [
      ["3-2b","Ich glaub, jetzt sind wir wirklich zu weit gegangen."],
      ["3-3b","Entschuldigen Sie Herr Polizist, mein Freund und ich haben Streit und sind gerade ganz aufgebracht. Wir wollten Sie nicht beleidigen. "],
      ["3-4b","Wir werden versuchen, unseren Konflikt anständig zu klären. "],
    ],
    'nathan_d': [
      ["3-2b","Ich glaub, jetzt sind wir wirklich zu weit gegangen."],
      ["3-3b","Entschuldigen Sie Herr Polizist, mein Freund und ich haben Streit und sind gerade ganz aufgebracht. Wir wollten Sie nicht beleidigen. "],
      ["3-4b","Wir werden versuchen, unseren Konflikt anständig zu klären. "],
    ],
  }
];
