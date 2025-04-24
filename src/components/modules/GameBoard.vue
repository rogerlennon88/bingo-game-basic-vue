<template>
  <div id="game-board" class="module">
    <div id="grid-game-board" class="board-y">
      <div class="group">
        <div class="cell"><button id="b-ggb" class="btn-ggb letter lock">B</button></div>
        <div class="cell"><button id="1" class="btn-ggb num" @click="marcarBalota('1')">1</button></div>
        <div class="cell"><button id="2" class="btn-ggb num" @click="marcarBalota('2')">2</button></div>
        <div class="cell"><button id="3" class="btn-ggb num" @click="marcarBalota('3')">3</button></div>
        <div class="cell"><button id="4" class="btn-ggb num" @click="marcarBalota('4')">4</button></div>
        <div class="cell"><button id="5" class="btn-ggb num" @click="marcarBalota('5')">5</button></div>
        <div class="cell"><button id="6" class="btn-ggb num" @click="marcarBalota('6')">6</button></div>
        <div class="cell"><button id="7" class="btn-ggb num" @click="marcarBalota('7')">7</button></div>
        <div class="cell"><button id="8" class="btn-ggb num" @click="marcarBalota('8')">8</button></div>
        <div class="cell"><button id="9" class="btn-ggb num" @click="marcarBalota('9')">9</button></div>
        <div class="cell"><button id="10" class="btn-ggb num" @click="marcarBalota('10')">10</button></div>
        <div class="cell"><button id="11" class="btn-ggb num" @click="marcarBalota('11')">11</button></div>
        <div class="cell"><button id="12" class="btn-ggb num" @click="marcarBalota('12')">12</button></div>
        <div class="cell"><button id="13" class="btn-ggb num" @click="marcarBalota('13')">13</button></div>
        <div class="cell"><button id="14" class="btn-ggb num" @click="marcarBalota('14')">14</button></div>
        <div class="cell"><button id="15" class="btn-ggb num" @click="marcarBalota('15')">15</button></div>
      </div>
      <div class="group">
        <div class="cell"><button id="i-ggb" class="btn-ggb letter lock">I</button></div>
        <div class="cell"><button id="16" class="btn-ggb num" @click="marcarBalota('16')">16</button></div>
        <div class="cell"><button id="17" class="btn-ggb num" @click="marcarBalota('17')">17</button></div>
        <div class="cell"><button id="18" class="btn-ggb num" @click="marcarBalota('18')">18</button></div>
        <div class="cell"><button id="19" class="btn-ggb num" @click="marcarBalota('19')">19</button></div>
        <div class="cell"><button id="20" class="btn-ggb num" @click="marcarBalota('20')">20</button></div>
        <div class="cell"><button id="21" class="btn-ggb num" @click="marcarBalota('21')">21</button></div>
        <div class="cell"><button id="22" class="btn-ggb num" @click="marcarBalota('22')">22</button></div>
        <div class="cell"><button id="23" class="btn-ggb num" @click="marcarBalota('23')">23</button></div>
        <div class="cell"><button id="24" class="btn-ggb num" @click="marcarBalota('24')">24</button></div>
        <div class="cell"><button id="25" class="btn-ggb num" @click="marcarBalota('25')">25</button></div>
        <div class="cell"><button id="26" class="btn-ggb num" @click="marcarBalota('26')">26</button></div>
        <div class="cell"><button id="27" class="btn-ggb num" @click="marcarBalota('27')">27</button></div>
        <div class="cell"><button id="28" class="btn-ggb num" @click="marcarBalota('28')">28</button></div>
        <div class="cell"><button id="29" class="btn-ggb num" @click="marcarBalota('29')">29</button></div>
        <div class="cell"><button id="30" class="btn-ggb num" @click="marcarBalota('30')">30</button></div>
      </div>
      <div class="group">
        <div class="cell"><button id="n-ggb" class="btn-ggb letter lock">N</button></div>
        <div class="cell"><button id="31" class="btn-ggb num" @click="marcarBalota('31')">31</button></div>
        <div class="cell"><button id="32" class="btn-ggb num" @click="marcarBalota('32')">32</button></div>
        <div class="cell"><button id="33" class="btn-ggb num" @click="marcarBalota('33')">33</button></div>
        <div class="cell"><button id="34" class="btn-ggb num" @click="marcarBalota('34')">34</button></div>
        <div class="cell"><button id="35" class="btn-ggb num" @click="marcarBalota('35')">35</button></div>
        <div class="cell"><button id="36" class="btn-ggb num" @click="marcarBalota('36')">36</button></div>
        <div class="cell"><button id="37" class="btn-ggb num" @click="marcarBalota('37')">37</button></div>
        <div class="cell"><button id="38" class="btn-ggb num" @click="marcarBalota('38')">38</button></div>
        <div class="cell"><button id="39" class="btn-ggb num" @click="marcarBalota('39')">39</button></div>
        <div class="cell"><button id="40" class="btn-ggb num" @click="marcarBalota('40')">40</button></div>
        <div class="cell"><button id="41" class="btn-ggb num" @click="marcarBalota('41')">41</button></div>
        <div class="cell"><button id="42" class="btn-ggb num" @click="marcarBalota('42')">42</button></div>
        <div class="cell"><button id="43" class="btn-ggb num" @click="marcarBalota('43')">43</button></div>
        <div class="cell"><button id="44" class="btn-ggb num" @click="marcarBalota('44')">44</button></div>
        <div class="cell"><button id="45" class="btn-ggb num" @click="marcarBalota('45')">45</button></div>
      </div>
      <div class="group">
        <div class="cell"><button id="g-ggb" class="btn-ggb letter lock">G</button></div>
        <div class="cell"><button id="46" class="btn-ggb num" @click="marcarBalota('46')">46</button></div>
        <div class="cell"><button id="47" class="btn-ggb num" @click="marcarBalota('47')">47</button></div>
        <div class="cell"><button id="48" class="btn-ggb num" @click="marcarBalota('48')">48</button></div>
        <div class="cell"><button id="49" class="btn-ggb num" @click="marcarBalota('49')">49</button></div>
        <div class="cell"><button id="50" class="btn-ggb num" @click="marcarBalota('50')">50</button></div>
        <div class="cell"><button id="51" class="btn-ggb num" @click="marcarBalota('51')">51</button></div>
        <div class="cell"><button id="52" class="btn-ggb num" @click="marcarBalota('52')">52</button></div>
        <div class="cell"><button id="53" class="btn-ggb num" @click="marcarBalota('53')">53</button></div>
        <div class="cell"><button id="54" class="btn-ggb num" @click="marcarBalota('54')">54</button></div>
        <div class="cell"><button id="55" class="btn-ggb num" @click="marcarBalota('55')">55</button></div>
        <div class="cell"><button id="56" class="btn-ggb num" @click="marcarBalota('56')">56</button></div>
        <div class="cell"><button id="57" class="btn-ggb num" @click="marcarBalota('57')">57</button></div>
        <div class="cell"><button id="58" class="btn-ggb num" @click="marcarBalota('58')">58</button></div>
        <div class="cell"><button id="59" class="btn-ggb num" @click="marcarBalota('59')">59</button></div>
        <div class="cell"><button id="60" class="btn-ggb num" @click="marcarBalota('60')">60</button></div>
      </div>
      <div class="group">
        <div class="cell"><button id="o-ggb" class="btn-ggb letter lock">O</button></div>
        <div class="cell"><button id="61" class="btn-ggb num" @click="marcarBalota('61')">61</button></div>
        <div class="cell"><button id="62" class="btn-ggb num" @click="marcarBalota('62')">62</button></div>
        <div class="cell"><button id="63" class="btn-ggb num" @click="marcarBalota('63')">63</button></div>
        <div class="cell"><button id="64" class="btn-ggb num" @click="marcarBalota('64')">64</button></div>
        <div class="cell"><button id="65" class="btn-ggb num" @click="marcarBalota('65')">65</button></div>
        <div class="cell"><button id="66" class="btn-ggb num" @click="marcarBalota('66')">66</button></div>
        <div class="cell"><button id="67" class="btn-ggb num" @click="marcarBalota('67')">67</button></div>
        <div class="cell"><button id="68" class="btn-ggb num" @click="marcarBalota('68')">68</button></div>
        <div class="cell"><button id="69" class="btn-ggb num" @click="marcarBalota('69')">69</button></div>
        <div class="cell"><button id="70" class="btn-ggb num" @click="marcarBalota('70')">70</button></div>
        <div class="cell"><button id="71" class="btn-ggb num" @click="marcarBalota('71')">71</button></div>
        <div class="cell"><button id="72" class="btn-ggb num" @click="marcarBalota('72')">72</button></div>
        <div class="cell"><button id="73" class="btn-ggb num" @click="marcarBalota('73')">73</button></div>
        <div class="cell"><button id="74" class="btn-ggb num" @click="marcarBalota('74')">74</button></div>
        <div class="cell"><button id="75" class="btn-ggb num" @click="marcarBalota('75')">75</button></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue"

export default {
  name: "GameBoard",
  setup(props, { emit }) {
    const marcarBalota = (numero) => {
      const boton = document.getElementById(numero)
      if (boton && !boton.classList.contains("marked")) {
        boton.classList.add("marked", "lock")
        emit("marcar-balota", numero)
      }
    }

    return {
      marcarBalota,
    }
  },
}
</script>

<style scoped>
/* game-board */
#game-board {
  background-color: rgb(36, 113, 163);
  border-radius: 4px;
}

/* Grid Game Board */
#grid-game-board {
  display: grid;
  gap: 2px;
}

/* Horizontal Grid */
#grid-game-board.board-x {
  grid-template-rows: repeat(5, 1fr);
}
#grid-game-board.board-x .group {
  grid-template-columns: repeat(16, 1fr);
}

/* Vertical Grid */
#grid-game-board.board-y {
  grid-template-columns: repeat(5, 1fr);
}
#grid-game-board.board-y .group {
  grid-template-rows: repeat(16, 1fr);
}

/* Groups and Cells */
#grid-game-board .group {
  display: grid;
  gap: 2px;
}
#grid-game-board .cell {
  display: grid;
}

/* General Buttons */
#grid-game-board .btn-ggb {
  color: white;
  aspect-ratio: 16 / 9;
  border: none;
  border-radius: 2px;
  display: grid;
  place-items: center;
  cursor: pointer;
  user-select: none;
}

/* Letter Button */
#grid-game-board .letter {
  background-color: rgb(84, 153, 199);
  font-size: 3.2rem;
  font-weight: var(--fw-bold);
  padding: calc(var(--gap) / 2);
}

/* Number Button */
#grid-game-board .num {
  background-color: rgb(251, 252, 252);
  color: rgb(52, 73, 94);
  font-size: 2.4rem;
  font-weight: var(--fw-bold);
}

/* Letter Button Status */
#grid-game-board .letter:hover {
  background-color: rgb(137, 207, 240);
  color: rgb(0, 71, 171);
  text-shadow: 0px 0px 8px rgba(255, 255, 255, 0.75);
}
#grid-game-board .letter:active {
  background-color: rgb(70, 130, 180);
  color: rgba(250, 249, 246, 0.32);
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.16);
  box-shadow: inset 0 0 8px 1px rgba(8, 24, 168, 0.5);
}
#grid-game-board .letter.marked {
  background-color: rgb(70, 130, 180);
  color: rgba(250, 249, 246, 0.32);
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.16);
  cursor: default;
  box-shadow: inset 0 0 8px 1px rgba(8, 24, 168, 0.5);
}

/* Number Button Status */
#grid-game-board .num:hover {
  background-color: rgb(255, 170, 51);
  color: var(--color-white);
}
#grid-game-board .num:active {
  background-color: rgb(228, 155, 15);
  color: rgb(243, 229, 171);
  text-shadow: 2px 2px 3px rgba(139, 64, 0, 0.74);
  box-shadow: inset 0 0 12px 2px rgba(139, 64, 0, 0.64);
}
#grid-game-board .num.marked {
  background-color: rgb(193, 154, 107);
  color: rgba(250, 249, 246, 0.75);
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.16);
  cursor: default;
  box-shadow: inset 0 0 8px 1px rgba(0, 0, 0, 0.5);
}

/* Border Radius Grid Buttons */
#grid-game-board .group:first-child .cell:first-child .btn-ggb {
  border-top-left-radius: 4px;
}
#grid-game-board .group:first-child .cell:last-child .btn-ggb {
  border-bottom-left-radius: 4px;
}
#grid-game-board .group:last-child .cell:first-child .btn-ggb {
  border-top-right-radius: 4px;
}
#grid-game-board .group:last-child .cell:last-child .btn-ggb {
  border-bottom-right-radius: 4px;
}
</style>
