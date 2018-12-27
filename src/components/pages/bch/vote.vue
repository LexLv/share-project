<template>
  <div class="home" >
    <div class="content-view" v-if="!isLoading">
      <div class="vote-view">
        <div class="top-view">
          <img :src="title_img[language]">
          <div class="tip" v-if="!isVote">{{$t('点击 支持/反对')}}</div>
        </div>
        <div class="chick-view" v-if="!isVote">
          <div class="support-view view " @click="vote(1)">{{$t('支持')}}<span class="support-img"><img src="@/assets/bch/yes.svg"></span></div>
          <div class="ratio">vs</div>
          <div class="oppose-view view " @click="vote(2)">{{$t('反对')}}<span class="oppose-img"><img src="@/assets/bch/no.svg"></span></div>
        </div>
        <div class="progress-view">
          <div :class="`box ${option_id == 1?'support-box':'oppose-box'}`" v-if="isVote"> <div class="text-info">{{$t(`${option_id == 1?'支持':'反对'}`)}}</div></div>
          <div class="progress">
            <div class="support-progress animated pulse delays-1s" id="support-progress"></div>
          </div>
          <div class="number-view">
            <div class="support">
              <p>{{supportNum}}</p>
              <p>BCH {{$t('支持')}}</p>
            </div>
            <div class="oppose">
              <p>{{opposeNum}}</p>
              <p>BCH {{$t('反对')}}</p>
            </div>
          </div>
        </div>
        <div class="tips-view">
          <div class="title">{{$t('投票规则')}}</div>
          <div class="tip-text">{{$t('1.投票会校验钱包BCH余额，每一BCH代表一票;')}}</div>
          <div class="tip-text">{{$t('2.投票不会发起BCH交易，不会消耗BCH;')}}</div>
          <div class="tip-text">{{$t('3.每个账户只能进行一次投票;')}}</div>
          <div class="tip-text">{{$t('4.投票需要在PureWallet中参与。')}}</div>
        </div>
        <div class="share-btn">
          <div class="btn" @click="share">{{$t('分享投票到微信')}}</div>
        </div>
      </div>
      <div class="share-view" v-show="isShowShareView" id="share-view" >
        <div class="logo-view"><img src="@/assets/bch/LOGO.svg"></div>
        <div class="top-view">
          <img :src="title_img[language]">
        </div>
        <div class="progress-view">
          <div class="progress">
            <div class="share-support-progress" id="share-support-progress"></div>
          </div>
          <div class="number-view">
            <div class="support">
              <p>{{supportNum}}</p>
              <p>BCH {{$t('支持')}}</p>
            </div>
            <div class="oppose">
              <p>{{opposeNum}}</p>
              <p>BCH {{$t('反对')}}</p>
            </div>
          </div>
        </div>
        <div class="tips-view">
          <div class="title">{{$t('投票规则')}}</div>
          <div class="tip-text">{{$t('1.投票会校验钱包BCH余额，每一BCH代表一票;')}}</div>
          <div class="tip-text">{{$t('2.投票不会发起BCH交易，不会消耗BCH;')}}</div>
          <div class="tip-text">{{$t('3.每个账户只能进行一次投票;')}}</div>
          <div class="tip-text">{{$t('4.投票需要在PureWallet中参与。')}}</div>
        </div>
        <div class="bottom-view">
          <div class="info-view">
            <img class="code-img" src="@/assets/bch/code.png">
            <div class="text-view">{{$t('扫码下载PureWallet，参与投票，共建中本聪点对点电子现金系统')}}</div>
          </div>
        </div>
      </div>
      <div class="mask-ovte-view animated fadeIn delays-1s" v-show="showVote" @click="close">
        <div class="tip-view" id="pop-view" v-if="isTip" >
          <div class="info-text-view">
            {{tipStr}}
          </div>
        </div>
        <div class="info-view" id="pop-view" v-else>
          <div class="content-view">
            <div class="info">{{$t('您可进行一次投票，是否继续？')}}</div>
            <div class="btn-view">
              <div class="cancel-btn" @click="showVote = false">{{$t('取消')}}</div>
              <div class="confim-btn" @click="toVote">{{$t('确定')}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="loading-view" v-else>
      <div class="ld ld-ball ld-wander-v" style="font-size:20px;color:#6066C0;"></div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
export default {
  name: 'Vote',
  data () {
    return {
      moda: '',
      title_img:{
        en: require('@/assets/bch/title_en.svg'),
        zh: require('@/assets/bch/title_cn.svg')
      },
      supportNum: 0,
      opposeNum: 0,
      isTip: false,
      tipStr: '',
      isVote: false,
      language: window.language || 'en',
      isLoading: true,
      isShowShareView: false,
      widthstr: '0%',
      option_id: 0,
      select_option_id: 1,
      xpub:'',
      balance:'',
      data: '',
      ua: '',
      showVote: false,
    }
  },
  components:{
    html2canvas
  },
  mounted(){
    this.getInfo()
    if (this.$route.query.xpub) {
      this.xpub = this.$route.query.xpub
    }
    if (this.$route.query.balance) {
      this.balance = this.$route.query.balance
    }
    this.ua = navigator.userAgent.toLowerCase()
    this.getAccountInfo()
  },
  methods:{
    getInfo () {
      axios.get('https://blockservice.bitapp.net.cn/api/vote/',{params:{vote_id:1}}).then(res => {
        this.isLoading = false
        if (res.status == 200 && res.data.status == 0) {
          var data = res.data.data
          var mainnum = 0
          data.option.forEach(element => {
            mainnum += element.num
            if (element.option_id == 1) {
              this.supportNum = element.num
            } else if (element.option_id == 2) {
              this.opposeNum = element.num
            }
          })
          var percent = this.supportNum / mainnum
          setTimeout(() => {
            this.setProgress(this.toPercent(percent))
          }, 200)
        }
      })
    },
    setProgress (widthstr) {
      var progress = document.getElementById("support-progress")
      var shareprogress = document.getElementById("share-support-progress")
      progress.style.width = widthstr
      shareprogress.style.width = widthstr
    },
    toPercent(point){
      var str = Number(point*100).toFixed(2)
      str += "%"
      return str
    },
    getAccountInfo() {
      if (!this.xpub) {
        return
      }
      axios.get('https://blockservice.bitapp.net.cn/api/voter/',{params:{vote_id:1,xpub:this.xpub}}).then(res => {
        if (res.status == 200 && res.data.status == 0) {
          var data = res.data.data
          if (data.voted) {
            this.isVote = data.voted
            this.option_id = data.option.vote_item_id
          }
        }
      })
    },
    toVote () {
      axios.post('https://blockservice.bitapp.net.cn/api/vote/',{vote_id:1,xpub:this.xpub,option_id:this.select_option_id,num:this.balance}).then(res => {
        if (res.status == 200 && res.data.status == 0) {
          this.tipStr = this.$t('您已参与投票')
          this.isTip = true
          this.getAccountInfo()
          this.getInfo()
          setTimeout(() => {
            this.showVote = false
            this.isTip = false
          }, 2000)
        }
      })
    },
    share () {
      // html2canvas(document.getElementById('share-view')).then(canvas=>{
      //   // var dataurl = canvas.toDataURL("image/png")
      //   document.body.appendChild(canvas)
      // })

      this.isShowShareView = true
      setTimeout(() => {
        html2canvas(document.getElementById('share-view')).then(canvas=>{
          var dataurl = canvas.toDataURL("image/png")
          this.data = dataurl
          window['requestEncodedString'] = () =>{
            this.requestEncodedString()
          }
          if (/iphone|ipad|ipod/.test(this.ua)) {
            window.webkit.messageHandlers.getShareImg.postMessage(this.data)
          }else if(/android/.test(this.ua)) {
            Android.checkStoragePermission()
          }
        })
      }, 200)
    },
    vote (option_id) {
      if (this.balance == 0) {
        this.tipStr = this.$t('余额为0,暂时无法进行投票')
        this.isTip = true
        this.showVote = true
        setTimeout(() => {
          this.showVote = false
          this.isTip = false
        }, 2000)
        return
      }
      this.showVote = true
      this.isTip = false
      this.select_option_id = option_id
    },
    requestEncodedString(){
      Android.requestEncodedString(this.data)
    },
    close (event) {
      var sp = document.getElementById("pop-view")
      if (sp && !sp.contains(event.target)) {
        this.showVote = false
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.home
  height 100%
  width 100%
  .content-view
    .vote-view
      position absolute
      top 0
      z-index 1
      height 100%
      display flex
      flex-direction column
      background-image url('../../../assets/bch/BG2.png')
      background-repeat repeat
      background-size 100% 100%
      .top-view
        padding 30px 25px
        .tip
          margin-top 12px
          font-size 15px
          color #FFFFFF
        >img 
          width 100%
      .chick-view
        margin-top 20px
        padding 0 25px
        display flex
        justify-content center
        align-items center
        font-size: 18px;
        color: #FFFFFF;
        .view
          position relative
          flex 1
          height 40px
          line-height 40px
          border-radius: 20px;
        .support-view
          background: #20E8F5;
          .support-img
            position absolute
            top -20px
            right -10px
            >img 
              width 38px 
        .ratio
          width 50px
          font-size: 40px;
          color: #FFFFFF;
        .oppose-view
          background: #FB5390;
          .oppose-img
            position absolute
            top -20px
            left -10px
            >img 
              width 38px 
      .progress-view
        padding 20px 30px 0 
        .box
          font-size 13px
        .support-box
          text-align left
          .text-info
            display inline-block
            border 1px solid #20E8F5
            padding 5px
            border-radius 6px
            color #20E8F5
        .oppose-box
          text-align right 
          .text-info
            display inline-block
            border 1px solid #FB5390
            color #FB5390
            padding 5px
            border-radius 6px
        .progress
          margin-top 10px
          position relative
          // background: repeating-linear-gradient(120deg, #58a, #58a 5px, #FB5390 0, #FB5390 20px);
          background: #FB5390
          height 15px
          border-radius 7.5px
          .support-progress
            height 100%
            width 50%
            position absolute
            top 0
            left 0
            // background: repeating-linear-gradient(120deg, #58a, #58a 5px, #20E8F5 0, #20E8F5 20px);
            background: #20E8F5
            height 15px
            border-radius: 7.5px; 
        .number-view 
          margin-top 10px
          display flex
          justify-content space-between
          font-size: 13px;
          color: #FFFFFF;
          .support
            text-align left 
            >p 
              line-height 18px
              margin 0
          .oppose
            text-align right 
            >p 
              line-height 18px
              margin 0
      .tips-view
        text-align left 
        padding 25px 25px 0
        font-size: 12px;
        color: #FFFFFF;
        line-height 23px
        .title
          font-size 14px
      .share-btn
        flex 1
        display flex
        align-items center
        justify-content center
        margin-top 20px
        margin-bottom 20px
        .btn
          padding 0 40px
          line-height 45px
          color #3CBA7A
          font-size 16px
          background #FFFFFF
          border-radius 22.5px
    .share-view
      position absolute
      z-index -1
      top 0
      display flex
      flex-direction column
      background-image url('../../../assets/bch/BG2.png')
      background-size 100% 100%
      background-repeat no-repeat
      .logo-view
        text-align left 
        padding 25px
        >img 
          height 32px
      .top-view
        padding 15px 25px
        >img 
          width 100%
      .progress-view
        padding 30px 30px 0
        .progress
          margin-top 10px
          position relative
          // background: repeating-linear-gradient(120deg, #58a, #58a 5px, #FB5390 0, #FB5390 20px);
          background: #FB5390
          height 15px
          border-radius 7.5px
          .share-support-progress
            height 100%
            width 50%
            position absolute
            top 0
            left 0
            // background: repeating-linear-gradient(120deg, #58a, #58a 5px, #20E8F5 0, #20E8F5 20px);
            background: #20E8F5
            height 15px
            border-radius: 7.5px; 
        .number-view 
          margin-top 10px
          display flex
          justify-content space-between
          font-size: 13px;
          color: #FFFFFF;
          .support
            text-align left 
            >p 
              line-height 18px
              margin 0
          .oppose
            text-align right 
            >p 
              line-height 18px
              margin 0
      .tips-view
        text-align left 
        padding 30px 25px 45px
        font-size: 12px;
        color: #FFFFFF;
        line-height 23px
        .title
          font-size 14px
      .bottom-view
        padding 0 15px 15px
        .info-view
          padding 15px
          background #FFFFFF
          border-radius 6px
          display flex
          justify-content center
          align-items center
          .code-img
            height 60px
          .text-view
            margin-left 15px
            text-align left 
            font-size 14px
            line-height 25px
            color #52525C
    .mask-ovte-view
      position absolute
      z-index 3
      top 0
      left 0
      width 100%
      height 100%
      background: rgba(0,0,0,0.4)
      display flex
      justify-content center
      align-items center
      .tip-view
        padding 60px
        font-size: 14px;
        color: #52525C;
        .info-text-view
          background: #FFFFFF;
          padding 20px
          border-radius: 6px;
      .info-view
        width 100%
        padding 0 50px
        .content-view
          background #FFF
          border-radius: 6px;
          .info
            font-size 14px
            padding 35px 0px
            color #52525C
          .btn-view
            display flex
            padding 20px 15px
            align-items center
            justify-content center
            font-size: 14px;    
            .cancel-btn
              flex 1
              border: 1px solid #6066C0;
              color: #6066C0;
              line-height 40px
              border-radius: 6px
              margin-right 10px
            .confim-btn
              flex 1
              background: #6066C0;
              color: #FFFFFF;
              line-height 40px
              border-radius: 6px
  .loading-view
    height 100%
    display flex
    justify-content center
    align-items center
</style>

