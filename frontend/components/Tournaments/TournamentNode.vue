<template>

  <!--  <pre>{{match}}</pre>-->

  <div v-if="match.previousTournamentMatches.length" :class="'item' + (round === finalRound ? ' root' : '')">
    <div class="item-parent">
    <TournamentPlayers :tournamentMatch="match" />
      <!--        :finalRound="finalRound"-->
      <!--        :round="round"-->
      <!--        :group="group"-->
    </div>
    <div class="item-children">
      <div
        v-for="matchID in match.previousTournamentMatches"
        :key="matchID"
        :class="'item-child' + (!getPreviousMatch(matchID).previousTournamentMatches.length ? ' leaf' : '')">
        <TournamentNode
          :matches="matches"
          :match="getPreviousMatch(matchID)"
          :finalRound="finalRound"
          :round="round - 1"
          :group="getPreviousMatch(matchID).group"
        />
      </div>
    </div>
  </div>

  <div v-else>
    <TournamentPlayers :tournamentMatch="match" />
    <!--      :finalRound="finalRound"-->
    <!--      :round="round"-->
    <!--      :group="group"-->
  </div>

</template>

<script>
import TournamentPlayers from "~/components/Tournaments/TournamentPlayers";

export default {
  name: "TournamentNode",
  props: ['match', 'matches', 'finalRound', 'round', 'group'],
  components: {TournamentPlayers},
  // data() {
  //   return {
  //     match: this.matches.find(m => m.round === this.round && m.group === this.group),
  //   }
  // },
  methods: {
    getPreviousMatch(matchID) {
      return this.matches.find(m => m._id === matchID);
    }
  },
  mounted() {
    this.$nextTick(() => {
      let root = document.querySelector(".root");
      root.scrollLeft = -root.scrollWidth;
    })
  },
}
</script>

<style scoped lang="scss">
$side-margin: 50px;
$vertical-margin: 10px;

.root {
  overflow-x: scroll;
  padding-right: 20px;
}

.item {
  display: flex;
  flex-direction: row-reverse;

  //p {
  //  padding: 20px;
  //  margin: 0;
  //  background-color: Beige;
  //  width: 200px;
  //}

  &-parent {
    position: relative;
    margin-left: $side-margin;
    display: flex;
    align-items: center;

    &:after {
      position: absolute;
      content: '';
      width: calc(#{$side-margin} / 2);
      height: 2px;
      left: 0;
      top: 50%;
      background-color: navy;
      transform: translateX(-100%);
    }
  }

  &-children {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &-child {
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    margin-top: $vertical-margin;
    margin-bottom: $vertical-margin;
    position: relative;
    width: 200px;

    &:before {
      content: '';
      position: absolute;
      background-color: navy;
      right: 0;
      top: 50%;
      transform: translateX(100%);
      width: 25px;
      height: 2px;
    }

    &:after {
      content: '';
      position: absolute;
      background-color: navy;
      right: calc(-#{$side-margin} / 2);
      height: calc(51% + 2 * #{$vertical-margin});
      top: calc(50%);
      width: 2px;
    }

    &:nth-child(2) {
      &:after {
        transform: translateY(-100%);
      }
    }

    &:nth-child(n+3) {
      &:after {
        height: calc(100% + 2 * #{$vertical-margin});
        top: calc(-50% - 2 * #{$vertical-margin});
      }
    }

    &:only-child:after {
      display: none;
    }

    .leaf > div {
      //min-width: 200px;
      //max-width: 200px;

      &:before {
        content: '';
        width: 20px;
        left: -20px;
        position: absolute;
        height: 1px;
      }
    }
  }
}
</style>
