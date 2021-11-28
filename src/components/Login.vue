<template>
<div class="login-container">
    <div class="loginLeft">
        <img src="../assets/imgs/login_img.png" >

    </div>
    <div class="loginRight">
        <div class="avatarBox">
            <img src="../assets/imgs/login_logo.png">
        </div>
        <div class="title">
            电商后台管理系统
        </div>
    </div>
    
</div>
    
</template>

<script>
export default{
    
}

</script>

<style lang="less" scoped>
    .login-container{
        background-color: #93defe;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .loginRight{
            width: 400px;
            height: 350px;
            background-color: #ffffff;
            padding: 50px;
            border-radius: 6px;
            box-sizing: border-box;
            position: relative;
            .avatarBox{
                position: absolute;
                width: 120px;
                height: 120px;
                border: 5px solid #93defe;
                border-radius: 100px;
                text-align: center;
                line-height: 110px;
                top: -60px;
                right: 140px;
                background-color: #ffffff;
            }
            .title{
                position: absolute;
                top: 100px; 
                left: 50%;
                transform: translate(-50%);
                font-size: 18px;
                color: #444444;
            }

        }
    }
    
</style>