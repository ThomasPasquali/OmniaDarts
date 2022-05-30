<template>
  <div class="container">
    <div class="wrapper">
      <TournamentNode
        :players="rounds.players"
        :children="rounds.children"
        :root="true"
      />
    </div>
  </div>
</template>

<script>
import {shuffle} from "lodash";
import {max, min} from "lodash/math";
import TournamentNode from "~/components/Tournaments/TournamentNode";

export default {
  name: "tournament",
  components: {TournamentNode},
  data() {
    const players_ = [
      {id: '1', name: 'Alice'},
      {id: '2', name: 'Bob'},
      {id: '3', name: 'Charlie'},
      {id: '4', name: 'Dave'},
      {id: '5', name: 'Eve'},
      {id: '6', name: 'Frank'},
      {id: '7', name: 'Gaspar'},
      {id: '8', name: 'Hilary'},
      {id: '9', name: 'Ilary'},
      {id: '10', name: 'Jennifer69'},
      {id: '11', name: 'Kuper'},
      {id: '12', name: 'Leonard'},
      {id: '13', name: 'Manny'},
      {id: '14', name: 'Nick'},
      {id: '15', name: 'Orson'},
      {id: '16', name: 'Paul'},
      {id: '17', name: 'Quaglia'},
      {id: '18', name: 'Ronchetti'},
      {id: '19', name: 'Sandri'},
      {id: '20', name: 'Takkello'},
      {id: '21', name: 'Ursula'},
      {id: '22', name: 'Vicky'},
      {id: '23', name: 'Walter'},
      {id: '24', name: 'Xavier'},
      {id: '25', name: 'Yepsilon'},
      {id: '25', name: 'Zzz'},
    ];

    const playersPerGroup = 3;
    // const groupsInFirstLayer = max(2, players_.length / playersPerGroup);

    let layers = [[]];
    let order_ = shuffle(players_.map(a => a.id));

    const rounds_ = {
      players: [],
      children: [
        {
          players: [],
          children: [
            {
              players: [],
              children: [
                {players: ['1', '2']},
                {players: ['3', '4']},
              ],
            },
            {
              players: [],
              children: [
                {players: ['5', '6']},
                {players: ['7', '8']},
                {players: ['9', '10']},
                {players: ['11', '12']},
              ],
            },
          ]
        },
        {
          players: [],
          children: [
            {
              players: [],
              children: [
                {players: ['13', '14']},
                {players: ['15', '16']},
                {players: ['17', '18']},
              ],
            },
            {
              players: [],
              children: [
                {players: ['19', '20']},
                {players: ['21', '22']},
                {players: ['21', '22']},
                {players: ['23', '24']},
                {players: ['25', '26']},
              ],
            },
          ],
        },
      ]
    }

    return {
      players: players_,
      rounds: rounds_,
      order: order_,
    }
  }
}
</script>

<style scoped>

.container {
  /*overflow: scroll;*/
  /*display: flex;*/
  /*flex-direction: row;*/
}

/*.wrapper::before {*/
/*  width: 20px;*/
/*  background: red;*/
/*}*/

.wrapper {
  /*display: flex;*/
  height: 600px;
  overflow: scroll;
  /*justify-content: center;*/
  background: antiquewhite;
}

</style>
