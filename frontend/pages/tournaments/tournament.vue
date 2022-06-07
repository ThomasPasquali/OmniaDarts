<template>
  <div class="container">
    <div class="wrapper">
      <TournamentNode
        :match="matchTree"
        :participants="participants"
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
    const players = [
      {id: '1', name: 'Anneliese'},
      {id: '2', name: 'Blanzieri'},
      {id: '3', name: 'Charlie'},
      {id: '4', name: 'Dave'},
      {id: '5', name: 'Eve'},
      {id: '6', name: 'Frank'},
      {id: '7', name: 'Gaspar'},
      {id: '8', name: 'Hilary'},
      {id: '9', name: 'Iuppa'},
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
      {id: '26', name: 'Zocca'},
    ];

    const playersPerGroup = 3;
    // const groupsInFirstLayer = max(2, players_.length / playersPerGroup);

    let layers = [[]];
    let order_ = shuffle(players.map(a => a.id));

    const rounds = {
      players: [],
      children: [
        {
          players: [],
          children: [
            {
              players: [],
              children: [
                {
                  players: [
                    {id: '1', points: 5},
                    {id: '2', points: 10},
                  ],
                  winner: '1'
                },
                {
                  players: [
                    {id: '3', points: 5},
                    {id: '4', points: 10},
                  ],
                  winner: '3'
                },
              ],
            },
            {
              players: [],
              children: [
                {
                  players: [
                    {id: '5', points: 5},
                    {id: '6', points: 10},
                  ],
                  winner: '6'
                },
                {
                  players: [
                    {id: '7', points: 5},
                    {id: '8', points: 10},
                  ],
                  winner: '8'
                },
                {
                  players: [
                    {id: '9', points: 5},
                    {id: '10', points: 10},
                  ],
                  winner: '9'
                },
                {
                  players: [
                    {id: '11', points: 5},
                    {id: '12', points: 10},
                  ],
                  winner: '11'
                },
              ],
            },
          ]
        },
        {
          players: [],
          children: [
            {
              players: [
                {id: '14', points: 10},
                {id: '16', points: 8},
                {id: '18', points: 3},
              ],
              winner: '16',
              children: [
                {
                  players: [
                    {id: '13', points: 5},
                    {id: '14', points: 10},
                  ],
                  winner: '13'
                },
                {
                  players: [
                    {id: '15', points: 5},
                    {id: '16', points: 10},
                  ],
                  winner: '15'
                },
                {
                  players: [
                    {id: '17', points: 5},
                    {id: '18', points: 10},
                  ],
                  winner: '18'
                },
              ],
            },
            {
              players: [],
              children: [
                {
                  players: [
                    {id: '19', points: 5},
                    {id: '20', points: 10},
                  ],
                  winner: '19'
                },
                {
                  players: [
                    {id: '21', points: 5},
                    {id: '22', points: 10},
                  ],
                  winner: '22'
                },
                {
                  players: [
                    {id: '23', points: 5},
                    {id: '24', points: 10},
                  ],
                  winner: '23'
                },
                {
                  players: [
                    {id: '25', points: 5},
                    {id: '26', points: 10},
                  ],
                  winner: '26'
                },
              ],
            },
          ],
        },
      ]
    }

    return {
      participants: players,
      matchTree: rounds,
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
  /*max-height: 600px;*/
  overflow-y: scroll;
  overflow-x: hidden;
  /*justify-content: center;*/
  background: antiquewhite;

}

</style>
