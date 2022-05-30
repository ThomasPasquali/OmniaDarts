<template>

  <div v-if="!!children" :class="'item' + (root ? ' root' : '')">
    <div class="item-parent">
      <p>{{ players }}</p>
    </div>
    <div class="item-children">
      <div
        v-for="(child, i) in children"
        :key="i"
        :class="'item-child' + (!child.children ? ' leaf' : '')">
        <TournamentNode
          :players="child.players"
          :children="child.children" />
      </div>
    </div>
  </div>

  <div v-else>
    <p>{{ players }}</p>
  </div>
</template>

<script>
export default {
  name: "TournamentNode",
  props: ['players', 'children', 'root']
}
</script>

<style scoped lang="scss">
$side-margin: 50px;
$vertical-margin: 10px;

.root {
  overflow: scroll;
  padding-right: 20px;
}

.item {
  display: flex;
  flex-direction: row-reverse;

  p {
    padding: 20px;
    margin: 0;
    background-color: Beige;
    width: 200px;
  }

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
      background-color: orange;
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
      background-color: orange;
      right: 0;
      top: 50%;
      transform: translateX(100%);
      width: 25px;
      height: 2px;
    }

    &:after {
      content: '';
      position: absolute;
      background-color: blue;
      right: calc(-#{$side-margin} / 2);
      height: calc(50% + 2 * #{$vertical-margin});
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

    .leaf {
      p {
        min-width: 200px;
        max-width: 200px;

        &:before {
          content: '';
          width: 20px;
          position: absolute;
          left: -60px;
          height: 1px;
        }
      }
    }
  }
}
</style>
