<template>
  <div class="citySelectWrapper">
    <el-cascader
      :options="selectedProvincesArr"
      @active-item-change="handleItemChange"
      :props="props"
      :placeholder="placeholder||'省份 / 市'"
      expand-trigger="hover"
      clearable
      @change='change'
    ></el-cascader>
  </div>
</template>

<script>
  import axios from 'axios'
  
  export default {
    name: "citySelect",
    props: {
      getEditCities: String
    },
    data() {
      return {
        placeholder: '',
        selectedProvincesArr: [],
        provinceAndCityCode: [],
        activeIndex: 0,
        props: {
          value: 'label',
          children: 'cities'
        }
      };
    },
    methods: {
      change(val) {
        let province = val[ 0 ];
        let city = val[ 1 ];
        let that = this;
        for ( var i = 0; i < that.selectedProvincesArr.length; i++ ) {
          if ( province === that.selectedProvincesArr[ i ].label ) {
            for ( var j = 0; j < that.selectedProvincesArr[ i ].cities.length; j++ ) {
              if ( city === that.selectedProvincesArr[ i ].cities[ j ].label ) {
                that.provinceAndCityCode[ 1 ] = that.selectedProvincesArr[ i ].cities[ j ].cityCode;
                break;
              }
            }
          }
        }
        console.log(that.provinceAndCityCode);
        this.$emit('provincesAndCities', that.provinceAndCityCode);
        
      },
      handleItemChange(val) {
        let province = val[ 0 ],
          that = this,
          length = that.selectedProvincesArr.length;
        for ( var i = 0; i < length; i++ ) {
          if ( province === that.selectedProvincesArr[ i ].label ) {
            that.provinceAndCityCode[ 0 ] = that.selectedProvincesArr[ i ].ProvinceCode;
            if ( that.selectedProvincesArr[ i ].cities.length ) {
              break;
            }
            axios.post('/api/Home/CityList', {ProvinceCode: that.selectedProvincesArr[ i ].ProvinceCode})
              .then(data => {
                that.selectedProvincesArr[ i ].cities = [];
                const res = data.data.Content,
                  length = res.length;
                
                for ( var j = 0; j < length; j++ ) {
                  that.selectedProvincesArr[ i ].cities[ j ] = {label: res[ j ].ItemName, cityCode: res[ j ].CityCode};
                  that.CityCode = that.selectedProvincesArr[ i ].cities[ j ].cityCode
                }
              });
            break;
          }
        }
        console.log(that.selectedProvincesArr);
      },
      getProvinces() {
        let that = this;
        that.placeholder = that.getEditCities;
        if ( !that.selectedProvincesArr.length ) {
          axios.post('/api/Home/ProvinceList')
            .then(data => {
              // console.log(data);
              const provincesAndCitiesArr = data.data.Content,
                length = provincesAndCitiesArr.length;
      
              if ( provincesAndCitiesArr ) {
                for ( var i = 0; i < length; i++ ) {
                  that.selectedProvincesArr.push({
                    label: provincesAndCitiesArr[ i ].ItemName,
                    cities: [],
                    ProvinceCode: provincesAndCitiesArr[ i ].ProvinceCode
                  })
                }
              }
            });
        }

      }
    }
    ,
    mounted() {
      this.getProvinces()
    }
  }
</script>
<style scoped lang="stylus">
  @import '~@/assets/styles/mixin.styl'
  .citySelectWrapper >>> .el-input__inner
    inputNoBorder()
  .citySelectWrapper>>>.el-cascader__label
    line-height 40px
    
  .citySelectWrapper >>> .el-input__inner::-webkit-input-placeholder
    color: #000;
  
  .citySelectWrapper
    .el-cascader
      line-height normal
      width 100%
    
</style>
