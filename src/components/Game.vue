<template>
  <div class="game">
    <h1>Idle Bots</h1>

    Materials: {{ show(materials) }}
    ({{ show(rate) }}/s)

    <transition-group name="slide">
      <div v-for="(bot, index) in bots" :key="bot.name" class="bot" v-if="isUnlocked(index)">
        <div class="desc">
          {{ show(bot.owned) }} {{ bot.name }}
          <button v-if="canUpgrade(bot)">Upgrade</button>
        </div>
        <div class="build">
          <button @click="build(bot)" :disabled="materials.lt(bot.cost)">Build 1 ({{ bot.cost }})</button>
          <button @click="buildMax(bot)" :disabled="materials.lt(bot.cost)">Build max: {{ show(materials.div(bot.cost).round(0, 0)) }}</button>
        </div>
      </div>
    </transition-group>

    <button @click="reset" style="position:fixed; top:5px; right:5px">Reset</button>

    <transition name="fade">
      <div class="dialog" v-if="state=='start'">
        <div class="content">
          Build some nanobots!<br>
          <br>
          <button @click="state = 'started'">Yes!</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Big from 'big.js'

const sleep = 100

export default {
  name: 'game',
  data () {
    return {
      materials: Big(100),
      rate: Big(0),
      ticker: 0,
      prevTick: new Date(),
      state: 'start',
      bots: [
        { name: 'Nanobots', owned: Big(0), cost: 100, generates: 1 },
        { name: 'Minibotsers', owned: Big(0), cost: 1000, generates: 10 },
        { name: 'Just, you know, bots', owned: Big(0), cost: 10000, generates: 100 },
        { name: 'Megabots', owned: Big(0), cost: 100000, generates: 1000 }
      ]
    }
  },
  methods: {
    reset: function () {
      this.materials = Big(100)
      this.rate = Big(0)
      this.ticker = 0
      this.prevTick = new Date()
      this.state = 'start'
      for (const bot of this.bots) {
        bot.owned = Big(0)
      }
    },
    tick: function () {
      const now = new Date()
      // FIXME limited to 1000 max ticks to prevent infinitish loops on load:
      const ticks = Math.min(Math.floor((now - this.prevTick) / sleep), 1000)
      if (ticks > 1) console.log('ticks', ticks)
      for (let i = 0; i < ticks; i++) {
        const before = this.materials
        for (const bot of this.bots) {
          this.materials = this.materials.plus(bot.owned.times(bot.generates))
        }
        this.rate = this.materials.minus(before).times(1000 / sleep)
      }
      this.prevTick = now

      this.ticker += ticks
      if (this.ticker % 10 === 0) this.save()

      setTimeout(this.tick, sleep)
    },
    build: function (b) {
      this.materials = this.materials.minus(b.cost)
      b.owned = b.owned.plus(1)
    },
    buildMax: function (b) {
      const max = this.materials.div(b.cost).round(0, 0)
      this.materials = this.materials.minus(max.times(b.cost))
      b.owned = b.owned.plus(max)
    },
    save: function () {
      window.localStorage.setItem('save', JSON.stringify({
        materials: this.materials,
        prevTick: this.prevTick,
        state: this.state,
        bots: this.bots.map(b => b.owned)
      }))
    },
    load: function () {
      const saved = JSON.parse(window.localStorage.getItem('save'))
      if (saved == null) return

      this.materials = Big(saved.materials)
      this.prevTick = new Date(saved.prevTick)
      this.state = saved.state
      for (let [index, value] of saved.bots.entries()) {
        this.bots[index].owned = Big(value)
      }
    },
    show: function (big) {
      return big.gte(1000000) ? big.toPrecision(3) : big.toString()
    },
    isUnlocked: function (index) {
      if (index === 0) return true
      return this.bots[index - 1].owned.gte(10)
    },
    canUpgrade: function (bot) {
      // TODO
      return false
    }
  },
  created: function () {
    Big.PE = 6
    this.load()
    window.addEventListener('beforeunload', this.save, false)
    this.tick()
  }
}
</script>

<style scoped>
button {
  border: 1px solid #aaa;
  border-radius: 5px;
  background-color: #ddd;
  padding: 10px;
}

.game {
  margin: 0 10px;
  text-align: center;
}

.bot {
  margin: 5px 0;
  padding: 5px;
  border-left: 1px solid #333;
  border-right: 1px solid #333;
  border-radius: 10px;
}
.desc, .build {
  display: flex;
  justify-content: space-between;
  line-height: 35px;
}
.build button {
  width: 50%;
  margin: 5px 0;
}
.build button:last-child {
  margin-left: 5px;
}

.dialog {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background-color: rgba(0, 0, 0, .8);
}
.dialog .content {
  background-color: white;
  color: #333;
  padding: 20px;
  margin: auto;
  max-width: 200px;
  border-radius: 10px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.fade-enter-active .content, .fade-leave-active .content {
  transition: transform 0.1s ease-in;
}
.fade-enter .content, .fade-leave-to .content {
  transform: scale(0)
}

.slide-enter-active, .slide-leave-active {
  transition: transform 1s ease-in-out;
}
.slide-enter, .slide-leave-to {
  transform: scaleY(0)
}
</style>
