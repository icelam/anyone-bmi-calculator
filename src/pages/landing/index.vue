<template>
  <div class="row">
    <!-- Right -->
    <div class="right">
      <!-- Draw Area -->
      <div class="draw-area">
        <div class="anyone" v-bind:style="{ 'height': drawHeight + '%' }">  
          <img src="@images/svg/head.svg" class="anyone__head"/>
          <img src="@images/svg/body.svg" class="anyone__body" v-bind:style="{ 'transform': 'scaleX(' + widthScale + ')' }"/>
        </div>
      </div>
      <!-- /Draw Area -->

      <!-- BMI Bar -->
      <div class="bmi">
        <div class="bmi__bar"></div>

        <!-- BMI Levels -->
        <div class="bmi__level bmi__level--level1">
          <span class="bmi__level__text">過輕</span>
          
          <div class="bmi__index bmi__index--level1" v-bind:style="{ 'left': bmi.percentageFromLeft + '%' }" v-if="bmi.level == 1">
            <span class="bmi__index__text">{{ bmi.result }}</span>
          </div>
        </div>
        <div class="bmi__level bmi__level--level2">
          <span class="bmi__level__text">正常</span>

          <div class="bmi__index bmi__index--level2" v-bind:style="{ 'left': bmi.percentageFromLeft + '%' }" v-if="bmi.level == 2">
            <span class="bmi__index__text">{{ bmi.result }}</span>
          </div>
        </div>
        <div class="bmi__level bmi__level--level3">
          <span class="bmi__level__text">過重</span>

          <div class="bmi__index bmi__index--level3" v-bind:style="{ 'left': bmi.percentageFromLeft + '%' }" v-if="bmi.level == 3">
            <span class="bmi__index__text">{{ bmi.result }}</span>
          </div>
        </div>
        <div class="bmi__level bmi__level--level4">
          <span class="bmi__level__text">痴肥</span>

          <div class="bmi__index bmi__index--level4" v-bind:style="{ 'left': bmi.percentageFromLeft + '%' }" v-if="bmi.level == 4">
            <span class="bmi__index__text">{{ bmi.result }}</span>
          </div>
        </div>
        <!-- /BMI Levels -->
      </div>
      <!-- /BMI Bar -->

    </div>
    <!-- /Right -->
    <!-- Left -->
    <div class="left">
      <h1>任何仁BMI計算機</h1>
      <div class="calculator">
        <!-- Height Input -->
        <div class="calculator__item">
          <label for="myHeight">身高</label>
          <div class="input-group">
            <div class="input-slider">
              <input type="range" name="heightSlider" id="heightSlider" v-bind:min="height.min" v-bind:max="height.max" step="1" v-model="anyone.height">
            </div>
            <div class="input-text">
              <input type="text" name="myHeight" id="myHeight" v-model.lazy="anyone.height" maxlength="3" @keypress.13="updateModel('height')" ref="inputHeight">
              <span class="unit">cm</span>
            </div>
          </div>
        </div>
        <!-- /Height Input -->
        <!-- Weight Input -->
        <div class="calculator__item">
          <label for="myWeight">體重</label>
          <div class="input-group">
            <div class="input-slider">
              <input type="range" name="weightSlider" id="weightSlider" v-bind:min="weight.min" v-bind:max="weight.max" step="1" v-model="anyone.weight">
            </div>
            <div class="input-text">
              <input type="text" name="myWeight" id="myWeight" v-model.lazy="anyone.weight" maxlength="3" @keypress.13="updateModel('weight')" ref="inputWeight">
              <span class="unit">kg</span>
            </div>
          </div>
        </div>
        <!-- /Weight Input -->
        <!-- Calculate Button -->
        <div class="calculator__button">
          <button>計算</button>
        </div>
        <!-- /Calculate Button -->
      </div>
    </div>
    <!-- /Left -->
  </div>
</template>

<script>
export default {
  name: 'landingPage',
  data() {
    return {
      //min, max, default - for inputs and BMI levels
      bmi: {
        levels: {
          1: {
            min: 7,
            max: 18.4
          },
          2: {
            min: 18.5,
            max: 24.9
          },
          3: {
            min: 25,
            max: 29.9
          },
          4: {
            min: 30,
            max: 89
          }
        },
        percentageFromLeft: 0, 
        result: 0,
        level: 1
      },
      height: {
        min: 130,
        max: 200,
        default: 170
      },
      weight: {
        min: 30,
        max: 150,
        default: 70
      },
      //user data - initial
      anyone: {
        height: 170,
        weight: 70,
        suggestedWeight: {
          lower: 0,
          upper: 0
        }
      },
      //validator
      validNumber: new RegExp(/^\d*\.?\d*$/)
    };
  },
  methods: {
    calculateBMI() {
      var heightSquared = (this.anyone.height / 100) * (this.anyone.height / 100);
      var preformattedBMI = this.anyone.weight / (heightSquared);
      this.bmi.result = Math.round(preformattedBMI * 10) / 10;

      this.anyone.suggestedWeight.lower = Math.round(18.5 * heightSquared * 10) / 10;
      this.anyone.suggestedWeight.upper = Math.round(24.9 * heightSquared * 10) / 10;
    },
    updateModel(mode) {
      if (mode === 'height') {
        this.$refs.inputHeight.blur();
      } else if (mode === 'weight') {
        this.$refs.inputWeight.blur();
      }
    }
  },
  mounted() {
    this.calculateBMI();
  },
  computed: {
    drawHeight() {
      return this.anyone.height / 2;
    },
    widthScale() {
      let weightFactor = 1;

      if (this.anyone.weight < this.anyone.suggestedWeight.lower) {
        weightFactor = this.anyone.weight / this.anyone.suggestedWeight.lower;
      } else if (this.anyone.weight > this.anyone.suggestedWeight.upper){
        weightFactor = this.anyone.weight / this.anyone.suggestedWeight.upper;
      }

      weightFactor = weightFactor < 0.75 ? 0.75 : weightFactor;
      weightFactor = weightFactor > 1.5 ? 1.5 : weightFactor;

      return weightFactor;
    }
  },
  watch: {
    'anyone.height': function() { 
      var h = this.anyone.height;
      var hDefault = this.height.default;
      var hMin = this.height.min;
      var hMax = this.height.max;

      if (h == '' || !this.validNumber.test(h)) {
        this.anyone.height = hDefault;
      } else if (h < hMin) {
        this.anyone.height = hMin;
      } else if (h > hMax) {
        this.anyone.height = hMax;
      } else {
        this.calculateBMI();
      }
    },
    'anyone.weight': function() {
      var w = this.anyone.weight;
      var wDefault = this.weight.default;
      var wMin = this.weight.min;
      var wMax = this.weight.max;

      if (w == '' || !this.validNumber.test(w)) {
        this.anyone.weight = wDefault;
      } else if (w < wMin) {
        this.anyone.weight = wMin;
      } else if (w > wMax) {
        this.anyone.weight = wMax;
      } else {
        this.calculateBMI();
      }
    },
    'bmi.result': function() {
      var bMin, bMax;
      var bResult = this.bmi.result;

      if (bResult <= this.bmi.levels[1].max) {
        this.bmi.level = 1;
      } else if (bResult >= this.bmi.levels[2].min && bResult <= this.bmi.levels[2].max) {
        this.bmi.level = 2;
      } else if (bResult >= this.bmi.levels[3].min && bResult <= this.bmi.levels[3].max) {
        this.bmi.level = 3;
      } else {
        this.bmi.level = 4;
      }

      bMin = this.bmi.levels[this.bmi.level].min;
      bMax = this.bmi.levels[this.bmi.level].max;
      this.bmi.percentageFromLeft = ((this.bmi.result - bMin) / (bMax - bMin)) * 100;
    }
  }
};
</script>