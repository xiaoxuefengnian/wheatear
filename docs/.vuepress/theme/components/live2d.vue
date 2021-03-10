<template>
  <div class="canvas-container">
    <canvas id="SAMPLE"
      :width="width"
      :height="height">
      このブラウザは
      <code>&lt;canvas&lt;</code>要素をサポートしていません。
    </canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: 1900,
      height: 1000
    }
  },
  mounted() {
    const addScript = (js) => {
      const localJs = document.createElement("script");
      localJs.setAttribute("src", `/live2d/${js}`)
      document.head.appendChild(localJs);
    }

    ['live2dcubismcore.min.js', 'index.js'].forEach(x => addScript(x));
  }
}
</script>

<style lang="stylus" scope>
.canvas-container
  width: 100%
  height: 100%

  > canvas
    width: 100%
    height: 100%
</style>
