<template>
  <div class="game">
    <h1>Idle Bots</h1>

    Materials: {{ materials.gte(1000000) ? materials.toPrecision(3) : materials.toString() }}
    ({{ rate.gte(1000000) ? rate.toPrecision(3) : rate.toString() }}/s)

    <div v-for="bot in bots" :key="bot.name" class="bot">
      <div class="desc">
        {{ bot.owned.toString() }} {{ bot.name }}
        <button>Upgrade</button>
      </div>
      <div class="buy">
        <button @click="buy(bot)" :disabled="materials.lt(bot.cost)">Buy 1 ({{ bot.cost }})</button>
        <button @click="buyMax(bot)" :disabled="materials.lt(bot.cost)">Buy Max</button>
      </div>
    </div>

    <button @click="reset">Reset</button>
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
      bots: [
        { name: 'Nanobots', owned: Big(0), cost: 100, generates: 1 },
        { name: 'Minibots', owned: Big(0), cost: 1000, generates: 10 },
        { name: 'Just, you know, bots', owned: Big(0), cost: 10000, generates: 100 },
        { name: 'Megabots', owned: Big(0), cost: 100000, generates: 1000 }
      ]
    }
  },
  methods: {
    tick: function () {
      this.ticker++
      if (this.ticker % 10 === 0) this.save()
      const before = this.materials
      for (const bot of this.bots) {
        this.materials = this.materials.plus(bot.owned.times(bot.generates))
      }
      this.rate = this.materials.minus(before).times(1000 / sleep)
      setTimeout(this.tick, sleep)
    },
    buy: function (b) {
      this.materials = this.materials.minus(b.cost)
      b.owned = b.owned.plus(1)
    },
    buyMax: function (b) {
      const max = this.materials.div(b.cost).round(0, 0)
      this.materials = this.materials.minus(max.times(b.cost))
      b.owned = b.owned.plus(max)
    },
    save: function () {
      window.localStorage.setItem('save', JSON.stringify({
        materials: this.materials,
        bots: this.bots.map(b => b.owned)
      }))
    },
    load: function () {
      const saved = JSON.parse(window.localStorage.getItem('save'))
      if (saved == null) return
      this.materials = Big(saved.materials)
      for (let [index, value] of saved.bots.entries()) {
        this.bots[index].owned = Big(value)
      }
    },
    reset: function () {
      this.materials = Big(100)
      this.ticket = 0
      for (const bot of this.bots) {
        bot.owned = Big(0)
      }
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
.desc, .buy {
  display: flex;
  justify-content: space-between;
  line-height: 35px;
}
.buy button {
  width: 50%;
  margin: 5px 0;
}
.buy button:last-child {
  margin-left: 5px;
}

</style>
