<template>
  <div class="container">
    <van-collapse v-model="activeNames">
      <van-collapse-item
        v-for="(s, idx) in sections"
        :title="s.title"
        :name="idx">
        <table>
        <tr v-for="c in s.content">
          <td>{{ c.name }}</td>
          <td v-for="value in c.values">{{ value }}</td>
        </tr>
        </table>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
export default {
  name: "stats",
  methods: {
    back() {
      window.history.back()
    }
  },
  data() {
    return {
      activeNames: [],
      sections: [
        {
          title: "Sect 1",
          content: [
            {name: 'a', values: ['1', '12', '13']},
            {name: 'b', values: ['2', '12', '13']},
            {name: 'c', values: ['3', '12', '13']},
          ]
        },
        {
          title: "Sect 2",
          content: [
            {name: 'a', values: ['1', '22', '23']},
            {name: 'b', values: ['2', '22', '23']},
            {name: 'c', values: ['3', '22', '23']},
          ]
        },
      ]
    }
  }
};

</script>


<style scoped>

#content {
  padding: 16px;
}

#club_photo {
  max-height: 200px;
  width: 100%;
  object-fit: cover;
}

#buttons {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

#add_btn {
  width: 100%;
}

#input_descr {
  width: 100%;
}

input[type=text], textarea {
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  display: block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type=submit], button {
  width: 100%;
  background-color: #04AA6D;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

input[type=submit]:hover, button {
  background-color: #45a049;
}

label, h3 {
  margin-top: 24px;
  font-size: 24px;
  font-weight: bold;
  display: block;
}

</style>
