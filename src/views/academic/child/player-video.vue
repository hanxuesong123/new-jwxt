<template>
    <div>
        <Modal v-model="value" :closable="false">

            <video-player class="video-player vjs-custom-skin"  :options="playerOptions" :x5-video-player-fullscreen="true"></video-player>

            <Input v-model="upperScore" style="margin: 10px 0px 10px 0px" placeholder="请输入学生上机分数" />

            <template slot="footer">
                <Button type="warning" style="margin-right: 5px" @click="handleSubmit">评分</Button>
                <Button type="primary" @click="cancel">取消</Button>
            </template>

        </Modal>
    </div>
</template>

<script>

    import { lastExam } from "@/api/academic/exam";

    export default {
        name: "player-video",
        data(){
            return {
                value : false,
                data:{},
                upperScore:0,
                //pictureImg: test,
                playerOptions: {
                    //playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                    autoplay: false, //如果true,浏览器准备好时开始回放。
                    muted: true, // 默认情况下将会消除任何音频。
                    loop: false, // 导致视频一结束就重新开始。
                    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [{
                        type: "video/mp4", //支持类型
                        src: this.filmSrc //视频地址
                        //src:
                    }],
                    poster: "../../../../assets/image/bg01.jpg", //你的封面地址
                    // width: document.documentElement.clientWidth, //播放器宽度
                    notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                    controlBar: {
                        timeDivider: false,
                        durationDisplay: false,
                        remainingTimeDisplay: true,
                        fullscreenToggle: true  //全屏按钮
                    }
                }
            }
        },
        computed:{
          filmSrc(){
              return this.data.list[0].zipUrl == null ? "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm" : this.data.list[0].zipUrl;
          }
        },
        methods:{
            handleSubmit(){
                console.log("zipUrl:",this.data.list[0].zipUrl);
                this.data.score.upperScore = this.upperScore;
                lastExam(this.data.score).then(res=>{
                    this.$Message.info(res.data.message);
                    this.data.score.upperScore = 0;
                    this.upperScore = 0;
                    this.value = false;
                })
            },
            cancel(){
                console.log(this.data.list);
                this.data.score.upperScore = 0;
                this.upperScore = 0;
                this.value = false;
            }
        }
    }
</script>

<style scoped>
    .video-js .vjs-icon-placeholder {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>