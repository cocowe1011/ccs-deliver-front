<template>
  <div class="dynamic">
    <el-button type="danger" icon="el-icon-close" style="position: absolute;z-index: 999;right: 15px;top: 70px;" @click="closeDynamicGraphShow"></el-button>
    <div class="dynamic-left">
      <div class="dynamic-left-top">
        <div>
          <div class="card-title">实时数据监控</div>
          <div class="card-content">
            <div class="data-card" style="padding:14px 10px 7px 20px">
              <div class="data-card-border">
                <div class="data-card-border-borderTop granient-text">订单号</div>
                <div class="data-card-border-borderDown" style="font-size: 1.3vw;">{{ orderMainDy.orderNo }}</div>
              </div>
            </div>
            <div class="data-card" style="padding: 14px 10px 7px 10px;">
              <div class="data-card-border">
                <div class="data-card-border-borderTop">箱子长度</div>
                <div class="data-card-border-borderDown">{{ orderMainDy.boxLength }}mm</div>
              </div>
            </div>
            <div class="data-card" style="padding: 14px 20px 7px 10px;">
              <div class="data-card-border">
                <div class="data-card-border-borderTop">箱子宽度</div>
                <div class="data-card-border-borderDown">{{ orderMainDy.boxWidth }}mm</div>
              </div>
            </div>
            <div class="data-card" style="padding: 7px 10px 7px 20px;">
              <div class="data-card-border">
                <div class="data-card-border-borderTop">箱子高度</div>
                <div class="data-card-border-borderDown">{{ orderMainDy.boxHeight }}mm</div>
              </div>
            </div>
            <div class="data-card" style="padding: 7px 10px 7px 10px;">
              <div class="data-card-border">
                <div class="data-card-border-borderTop">束下设置速度</div>
                <div class="data-card-border-borderDown">{{ orderMainDy.sxSpeedSet }}米/分钟</div>
              </div>
            </div>
            <div class="data-card" style="padding: 7px 20px 7px 10px;">
              <div class="data-card-border">
                <div class="data-card-border-borderTop granient-text">束下实时速度</div>
                <div class="data-card-border-borderDown">{{ lightBeamRealTimeSpeed }}米/分钟</div>
              </div>
            </div>
            <div class="data-card" style="padding: 7px 10px 14px 20px;">
              <div class="data-card-border">
                <div class="data-card-border-borderTop granient-text">订单圈数</div>
                <div class="data-card-border-borderDown">{{ orderMainDy.numberTurns }}</div>
              </div>
            </div>
            <!-- <div class="data-card" style="padding: 7px 10px 14px 10px;">
              <div class="data-card-border">
                <div class="data-card-border-borderTop">订单圈数</div>
                <div class="data-card-border-borderDown">{{ orderMainDy.numberTurns }}</div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
      <div class="dynamic-left-middle">
        <div>
          <div class="card-title">操作区</div>
          <div class="card-content" style="display: flex;align-items: center;">
            <!-- 操作按钮 -->
            <div :class="['img', fullPause?'img-active':'']" @click="operationConfirm('suspend')">
              全线<br/>暂停
            </div>
            <div :class="['img', fullRun?'img-active':'']" @click="operationConfirm('run')">
              全线<br/>启动
            </div>
            <div :class="['img', fullStop?'img-active':'']" @click="operationConfirm('stop')">
              全线<br/>停止
            </div>
            <div class="img" @click="operationConfirm('clear')">
              全线<br/>清空
            </div>
          </div>
        </div>
      </div>
      <div class="dynamic-left-down">
        <div>
          <div class="card-title">
            <el-badge :value="logNotReadNumber" :max="99" class="item" :hidden="logNotReadNumber==0">
              <div :class="['log-class', logPageFlag == 'log'?'log-class-active':'']" @click="showRunlog">操作日志</div>
            </el-badge>
            &nbsp;/&nbsp;
            <el-badge :value="errorLogNotReadNumber" :max="99" class="item" :hidden="errorLogNotReadNumber==0">
              <div :class="['log-class', logPageFlag == 'error-log'?'log-class-active':'']" @click="showErrorlog">报警日志</div>
            </el-badge>
          </div>
          <div class="card-content" ref="logContainer">
            <template v-if="logPageFlag == 'log'">
              <div class="log-text" v-for="(message, index) in logArr" :key="index">
                {{ message.text }}
              </div>
            </template>
            <template v-else>
              <div class="log-text" v-for="(message, index) in errorLogArr" :key="index">
                {{ message.text }}
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="dynamic-right">
      <div>
        <div class="card-title">实时状态监控</div>
        <div class="card-content" style="display: flex;justify-content: center;" ref="parent">
          <div class="dyscare chuansongpadding" style="width: 821px;height: 100%;position: relative;" ref="child">
            <img src="./img/fushe2x.png" class="fusheIcon"/>
            <transition name="el-fade-in-linear">
              <img src="./img/deng.png" class="fusheguang" v-show="dengShow"/>
            </transition>
            <img src="./img/chuansongdai1.png" style="width: 820.18px;height: 799.14px;margin-top:60px" />
            <!-- ab队列遮罩 -->
            <img src="./img/ab/qp-ab.png" class="arr-ab" style="width: 42px;height: 321px;right: 10px;top: 380px;" @mouseover="showAllImages('arr-ab')" @mouseout="hideAllImages('arr-ab')"/>
            <!-- bc队列遮罩 -->
            <img src="./img/bc/qp-bc-1.png" class="arr-bc" style="width: 42px;height: 24px;right: 9px;top: 359px;" @mouseover="showAllImages('arr-bc')" @mouseout="hideAllImages('arr-bc')"/>
            <img src="./img/bc/qp-bc-2.png" class="arr-bc" style="width: 296px;height: 42px;right: 9px;top: 317px;border-radius: 0 50px 0 50px;" @mouseover="showAllImages('arr-bc')" @mouseout="hideAllImages('arr-bc')"/>
            <img src="./img/bc/qp-bc-3.png" class="arr-bc" style="width: 42px;height: 125px;right: 262px;top: 192px;" @mouseover="showAllImages('arr-bc')" @mouseout="hideAllImages('arr-bc')"/>
            <img src="./img/bc/qp-bc-4.png" class="arr-bc" style="width: 198px;height: 42px;top: 193px;right: 64px;" @mouseover="showAllImages('arr-bc')" @mouseout="hideAllImages('arr-bc')"/>
            <img src="./img/bc/qp-bc-5.png" class="arr-bc" style="width: 42px;height: 46px;top: 147px;right: 65px;" @mouseover="showAllImages('arr-bc')" @mouseout="hideAllImages('arr-bc')"/>
            <!-- cd队列遮罩 -->
            <img src="./img/cd/qp-cd-1.png" class="arr-cd" style="width: 42px;height: 38px;right: 64px;top: 109px;" @mouseover="showAllImages('arr-cd')" @mouseout="hideAllImages('arr-cd')"/>
            <img src="./img/cd/qp-cd-2.png" class="arr-cd" style="width: 547px;height: 41px;right: 63px;top: 68px; border-radius: 50px 50px 0 0;" @mouseover="showAllImages('arr-cd')" @mouseout="hideAllImages('arr-cd')"/>
            <img src="./img/cd/qp-cd-3.png" class="arr-cd" style="width: 41px;height: 40px;right: 567px;top: 109px;" @mouseover="showAllImages('arr-cd')" @mouseout="hideAllImages('arr-cd')"/>
            <!-- de队列遮罩 -->
            <img src="./img/de/qp-de-1.png" class="arr-de" style="width: 42px;height: 44px;right: 567px;top: 149px;" @mouseover="showAllImages('arr-de')" @mouseout="hideAllImages('arr-de')"/>
            <img src="./img/de/qp-de-2.png" class="arr-de" style="width: 207px;height: 42px;right: 402px;top: 193px;" @mouseover="showAllImages('arr-de')" @mouseout="hideAllImages('arr-de')"/>
            <img src="./img/de/qp-de-3.png" class="arr-de" style="width: 43px;height: 119px;right: 359px;top: 192px;" @mouseover="showAllImages('arr-de')" @mouseout="hideAllImages('arr-de')"/>
            <img src="./img/de/qp-de-4.png" class="arr-de" style="width: 309px;height: 42px;right: 359px;top: 311px;" @mouseover="showAllImages('arr-de')" @mouseout="hideAllImages('arr-de')"/>
            <img src="./img/de/qp-de-5.png" class="arr-de" style="width: 42px;height: 62px;right: 625px;top: 353px;" @mouseover="showAllImages('arr-de')" @mouseout="hideAllImages('arr-de')"/>
            <!-- ei队列遮罩层 -->
            <img src="./img/ei/qp-ei.png" class="arr-ei" style="width: 42px;height: 264px;right: 625px;top: 415px;" @mouseover="showAllImages('arr-ei')" @mouseout="hideAllImages('arr-ei')"/>
            <!-- jk队列遮罩层 -->
            <img src="./img/jk/qp-jk.png" class="arr-jk" style="width: 573px;height: 42px;right: 52px;top: 591px;" @mouseover="showAllImages('arr-jk')" @mouseout="hideAllImages('arr-jk')"/>
            <!-- f队列遮罩 -->
            <img src="./img/f/qp-f-1.png" class="arr-f" style="width: 146px;height: 42px;right: 665px;top: 474px;" @mouseover="showAllImages('arr-f')" @mouseout="hideAllImages('arr-f')"/>
            <img src="./img/f/qp-f-2.png" class="arr-f" style="width: 43px;height: 175px;right: 768px;top: 299px;" @mouseover="showAllImages('arr-f')" @mouseout="hideAllImages('arr-f')"/>
            <!-- gh队列 -->
            <img src="./img/gh/qp-gh-1.png" class="arr-gh" style="width: 251px;height: 41px;right: 362px;top: 473px;" @mouseover="showAllImages('arr-gh')" @mouseout="hideAllImages('arr-gh')"/>
            <img src="./img/gh/qp-gh-2.png" class="arr-gh" style="width: 131px;height: 41px;right: 52px;top: 405px;" @mouseover="showAllImages('arr-gh')" @mouseout="hideAllImages('arr-gh')"/>
            <div class="show-data-area" style="right: 110px;top: 681px;">
              <div class="show-data-area-top">ID信息</div>
              <div class="show-data-area-content">
                <el-input readonly size="small" v-model="nowABoxImitateId"></el-input>
              </div>
            </div>
            <div class="show-data-area" style="right: 110px;top: 719px;">
              <div class="show-data-area-top">上货扫码信息</div>
              <div class="show-data-area-content">
                <el-input v-model="loadScanCode" readonly size="small"></el-input>
              </div>
            </div>
            <div class="show-data-area" style="right: 110px;top: 757px;">
              <div class="show-data-area-top">当前上货数量</div>
              <div class="show-data-area-content">
                <el-input v-model="nowInNum" readonly size="small"></el-input>
              </div>
            </div>
            <div class="show-data-area" style="left: -18px;top: 543px;width: 150px;height: 52px;">
              <div class="show-data-area-top" style="width: 100%;height: 26px;">ID信息</div>
              <div class="show-data-area-content" style="width: 100%;height: 26px;">
                <el-input readonly size="small" v-model="nowEBoxImitateId"></el-input>
              </div>
            </div>
            <div class="show-data-area" style="left: -18px;top: 595px;width: 150px;height: 52px;">
              <div class="show-data-area-top" style="width: 100%;height: 26px;">下货扫码信息</div>
              <div class="show-data-area-content" style="width: 100%;height: 26px;">
                <el-input v-model="labyrinthScanCode" readonly size="small"></el-input>
              </div>
            </div>
            <div class="show-data-area" style="left: -2px;top: 218px;width: 150px;height: 52px;">
              <div class="show-data-area-top" style="width: 100%;height: 26px;">当前下货数量</div>
              <div class="show-data-area-content" style="width: 100%;height: 26px;">
                <el-input v-model="nowOutNum" readonly size="small"></el-input>
              </div>
            </div>
            <div class="show-data-area" style="left: 413px;top: 118px;width: 150px;height: 52px;">
              <div class="show-data-area-top" style="width: 100%;height: 26px;">束下当前货物ID</div>
              <div class="show-data-area-content" style="width: 100%;height: 26px;">
                <el-input v-model="nowShuXiaid" readonly size="small"></el-input>
              </div>
            </div>
            <div class="show-data-area" style="left: 103px;top: 702px;width: 150px;height: 52px;">
              <div class="show-data-area-top" style="width: 100%;height: 26px;">当前剔除数量</div>
              <div class="show-data-area-content" style="width: 100%;height: 26px;">
                <el-input v-model="nowTiChuNum" readonly size="small"></el-input>
              </div>
            </div>
            <!-- 光电星星 -->
            <div class="guangdian" style="top: 686px;right: 53px;" @click="analogOptoelectronics('A')">
              <div class='star' v-show="pointA == '1'"></div>
              <div class="pointText">A</div>
            </div>
            <div class="guangdian" style="top: 358px;right: 44px;" @click="analogOptoelectronics('B')">
              <div class='star' v-show="pointB == '1'"></div>
              <div class="pointText">B</div>
            </div>
            <div class="guangdian" style="top: 127px;right: 102px;" @click="analogOptoelectronics('C')">
              <div class='star' v-show="pointC == '1'"></div>
              <div class="pointText">C</div>
            </div>
            <div class="guangdian" style="top: 125px;right: 604px;" @click="analogOptoelectronics('D')">
              <div class='star' v-show="pointD == '1'"></div>
              <div class="pointText">D</div>
            </div>
            <div class="guangdian" style="top: 391px;right: 667px;" @click="analogOptoelectronics('E')">
              <div class='star' v-show="pointE == '1'"></div>
              <div class="pointText">E</div>
            </div>
            <div class="guangdian" style="right: 716px;top: 512px;" @click="analogOptoelectronics('F')">
              <div class='star' v-show="pointF == '1'"></div>
              <div class="pointText">F</div>
            </div>
            <div class="guangdian" style="right: 465px;top: 421px;" @click="analogOptoelectronics('G')">
              <div class='star' v-show="pointG == '1'"></div>
              <div class="pointText">G</div>
            </div>
            <div class="guangdian" style="right: 91px;top: 442px;" @click="analogOptoelectronics('H')">
              <div class='star' v-show="pointH == '1'"></div>
              <div class="pointText">H</div>
            </div>
            <div class="guangdian" style="right: 659px;top: 638px;" @click="analogOptoelectronics('I')">
              <div class='star' v-show="pointI == '1'"></div>
              <div class="pointText">I</div>
            </div>
            <div class="guangdian" style="right: 526px;top: 638px;" @click="analogOptoelectronics('J')">
              <div class='star' v-show="pointJ == '1'"></div>
              <div class="pointText">J</div>
            </div>
            <div class="guangdian" style="right: 60px;top: 545px;" @click="analogOptoelectronics('K')">
              <div class='star' v-show="pointK == '1'"></div>
              <div class="pointText">K</div>
            </div>
            <!-- 电机状态 -->
            <div v-show="false" :class="['dianji', dianJiStatusArr[7] == '1' ? 'dianji-active' : '']" style="top: 640px;right: 133px;">100#电机</div>
            <div v-show="false" :class="['dianji', dianJiStatusArr[6] == '1' ? 'dianji-active' : '']" style="top: 416px;right: 6px;">101#电机</div>
            <div v-show="false" :class="['dianji', dianJiStatusArr[5] == '1' ? 'dianji-active' : '']" style="top: 386px;right: 190px;">102#电机</div>
            <div v-show="false" :class="['dianji', dianJiStatusArr[4] == '1' ? 'dianji-active' : '']" style="top: 258px;right: 190px;">103#电机</div>
            <div v-show="false" :class="['dianji', dianJiStatusArr[3] == '1' ? 'dianji-active' : '']" style="top: 132px;right: 190px;">104#电机</div>
            <div v-show="false" :class="['dianji', dianJiStatusArr[2] == '1' ? 'dianji-active' : '']" style="top: 88px;right: 450px;">105#电机</div>
            <div v-show="false" :class="['dianji', dianJiStatusArr[1] == '1' ? 'dianji-active' : '']" style="top: 131px;right: 538px;">106#电机</div>
            <div v-show="false" :class="['dianji', dianJiStatusArr[0] == '1' ? 'dianji-active' : '']" style="top: 259px;right: 516px;">107#电机</div>
            <div v-show="false" :class="['dianji', dianJiStatusArr[15] == '1' ? 'dianji-active' : '']" style="top: 379px;right: 516px;">108#电机</div>
            <div v-show="false" :class="['dianji', dianJiStatusArr[14] == '1' ? 'dianji-active' : '']" style="top: 379px;right: 641px;">109#电机</div>
            <div v-show="false" :class="['dianji', dianJiStatusArr[13] == '1' ? 'dianji-active' : '']" style="top: 420px;right: 727px;">110#电机</div>
            <div v-show="false" :class="['dianji', dianJiStatusArr[12] == '1' ? 'dianji-active' : '']" style="top: 638px;right: 730px;">111#电机</div>
            <div v-show="false" :class="['dianji', dianJiStatusArr[11] == '1' ? 'dianji-active' : '']" style="top: 639px;right: 627px;">112#电机</div>
            <div v-show="false" :class="['dianji', dianJiStatusArr[10] == '1' ? 'dianji-active' : '']" style="top: 596px;right: 450px;">113#电机</div>
            <div v-show="false" :class="['dianji', dianJiStatusArr[9] == '1' ? 'dianji-active' : '']" style="top: 596px;right: 264px;">114#电机</div>
            <div v-show="false" :class="['dianji', dianJiStatusArr[8] == '1' ? 'dianji-active' : '']" style="top: 690px;right: 367px;">115#电机</div>
            <!-- 队列信息 -->
            <el-tooltip class="item" effect="dark" content="A-B货物队列" placement="left" :value="abTipShow" :manual="true">
              <div class="box-num-tip" style="top: 526px;right: 17px;" @click="showChuanSong('AB')" @mouseover="showAllImages('arr-ab')" @mouseout="hideAllImages('arr-ab')">{{ arrAB.length }}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="B-C货物队列" placement="right" :value="bcTipShow" :manual="true">
              <div class="box-num-tip" style="top: 259px;right: 269px;" @click="showChuanSong('BC')" @mouseover="showAllImages('arr-bc')" @mouseout="hideAllImages('arr-bc')">{{ arrBC.length }}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="C-D货物队列" placement="top" :value="cdTipShow" :manual="true">
              <div class="box-num-tip" style="top: 74px;right: 323px;" @click="showChuanSong('CD')" @mouseover="showAllImages('arr-cd')" @mouseout="hideAllImages('arr-cd')">{{ arrCD.length }}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="D-E货物队列" placement="left" :value="deTipShow" :manual="true">
              <div class="box-num-tip" style="top: 259px;left: 428px;" @click="showChuanSong('DE')" @mouseover="showAllImages('arr-de')" @mouseout="hideAllImages('arr-de')">{{ arrDE.length }}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="E-I货物队列" placement="right" :value="eiTipShow" :manual="true">
              <div class="box-num-tip" style="top: 534px;left: 166px;" @click="showChuanSong('EI')" @mouseover="showAllImages('arr-ei')" @mouseout="hideAllImages('arr-ei')">{{ arrEI.length }}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="G-H货物队列" placement="bottom" :value="ghTipShow" :manual="true">
              <div class="box-num-tip" style="top: 479px;right: 415px;" @click="showChuanSong('GH')" @mouseover="showAllImages('arr-gh')" @mouseout="hideAllImages('arr-gh')">{{ arrGH.length }}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="J-K货物队列" placement="bottom" :value="jkTipShow" :manual="true">
              <div class="box-num-tip" style="top: 599px;right: 326px;" @click="showChuanSong('JK')" @mouseover="showAllImages('arr-jk')" @mouseout="hideAllImages('arr-jk')">{{ arrJK.length }}</div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="F货物队列" placement="left" :value="fTipShow" :manual="true">
              <div class="box-num-tip" style="top: 372px;left: 20px;" @click="showChuanSong('F')" @mouseover="showAllImages('arr-f')" @mouseout="hideAllImages('arr-f')">{{ arrF.length }}</div>
            </el-tooltip>
            <!-- 预警 -->
            <img src="./img/yujing.png" class="warning-img" v-show="yujingShow" style="left: -30px;top: 655px;"/>
            <img src="./img/baojing.png" class="warning-img" v-show="baojingShow" style="top: 717px;left: 352px;"/>
            <div style="width: 70px;height: 70px;left: 680px;position: absolute;background-color: lightcoral;color: white;display: flex;justify-content: center;align-items: center;top: 792px;" v-show="banLoadStatus">
              禁止上货
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-drawer
      title="快捷移动-拖动表格切换队列"
      :visible.sync="drawer"
      :modal-append-to-body="false"
      border
      size="1200px">
      <div class="drawer-left">
        <div class="content_table">
          <div class="table_head">
            <table>
              <thead>
                <tr>
                  <th style="width:40px;">
                    <div>序号</div>
                  </th>
                  <th style="width: 150px">
                    <div>订单号</div>
                  </th>
                  <th style="width: 120px">
                    <div>箱编号</div>
                  </th>
                  <th style="width: 150px">
                    <div>一维/二维码信息</div>
                  </th>
                  <th style="width: 130px">
                    <div>进入时间</div>
                  </th>
                  <th style="width: 60px">
                    <div>圈数</div>
                  </th>
                  <th style="width: 60px">
                    <div>翻转</div>
                  </th>
                  <th style="width: 60px">
                    <div>已完成</div>
                  </th>
                  <th style="width: 60px">
                    <div>合格</div>
                  </th>
                  <th style="width: 60px">
                    <div>状态</div>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          <div class="table_list">
            <table>
              <tbody>
                <tr v-for="(item, index) in boxArr" class="body-col" :key="index" draggable="true" @dragstart="dragStart(index)">
                  <td style="width: 40px;">{{ index + 1 }}</td>
                  <td style="width: 150px">{{ orderMainDy.orderNo }}</td>
                  <td style="width: 120px;">{{ item.boxImitateId }}</td>
                  <td style="width: 150px">{{ item.loadScanCode }}</td>
                  <td style="width: 130px">{{ item.turnsInfoList[0].passATime }}</td>
                  <td style="width: 60px">{{ item.numberTurns }}</td>
                  <td style="width: 60px">{{ orderMainDy.revertFlag == '翻转' ? '√': 'X' }}</td>
                  <td style="width: 60px">{{ item.xiahuoFlag ? '√': '' }}</td>
                  <td style="width: 60px">
                    <el-tag type="success" v-if="item.qualified === '1'" size="mini">合格</el-tag>
                    <el-tag type="danger" v-else-if="item.qualified === '0'" size="mini">不合格</el-tag>
                    <div v-else></div>
                  </td>
                  <td style="width: 60px">
                    <el-tag type="success" v-if="item.xiahuoFlag" size="mini">已下货</el-tag>
                    <el-tag type="danger" v-if="item.tichuFlag" size="mini">已剔除</el-tag>
                    <el-tag v-if="!item.xiahuoFlag && !item.tichuFlag" size="mini">执行中</el-tag>
                  </td>
                </tr>
              </tbody>
            </table>
          </div><!-- <orderList id="orderListComp" ref="orderListComp" :visible="visibleOrderList" :add-data="addData" left="210px" top="95px" @changeSearchWindow="changeSearchWindow" @selectOrderItem="selectOrderItem"></orderList> -->
        </div>
      </div>
      <div class="drawer-right">
        <div :class="['transform-card',traAB?'transform-card-active':'']" @dragover.prevent @drop="dropItem('AB', $event)" @click="showCache('AB')" @dragenter="dragEnter" @dragleave="dragLeave">A-B队列</div>
        <div :class="['transform-card',traBC?'transform-card-active':'']" @dragover.prevent @drop="dropItem('BC', $event)" @click="showCache('BC')" @dragenter="dragEnter" @dragleave="dragLeave">B-C队列</div>
        <div :class="['transform-card',traCD?'transform-card-active':'']" @dragover.prevent @drop="dropItem('CD', $event)" @click="showCache('CD')" @dragenter="dragEnter" @dragleave="dragLeave">C-D队列</div>
        <div :class="['transform-card',traDE?'transform-card-active':'']" @dragover.prevent @drop="dropItem('DE', $event)" @click="showCache('DE')" @dragenter="dragEnter" @dragleave="dragLeave">D-E队列</div>
        <div :class="['transform-card',traEI?'transform-card-active':'']" @dragover.prevent @drop="dropItem('EI', $event)" @click="showCache('EI')" @dragenter="dragEnter" @dragleave="dragLeave">E-I队列</div>
        <div :class="['transform-card',traGH?'transform-card-active':'']" @dragover.prevent @drop="dropItem('GH', $event)" @click="showCache('GH')" @dragenter="dragEnter" @dragleave="dragLeave">G-H队列</div>
        <div :class="['transform-card',traJK?'transform-card-active':'']" @dragover.prevent @drop="dropItem('JK', $event)" @click="showCache('JK')" @dragenter="dragEnter" @dragleave="dragLeave">J-K队列</div>
        <div :class="['transform-card',traF?'transform-card-active':'']" @dragover.prevent @drop="dropItem('F', $event)" @click="showCache('F')" @dragenter="dragEnter" @dragleave="dragLeave">F队列</div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { EventBus } from '@/utils/EventBus'
import { Debugger, ipcRenderer } from 'electron'
import HttpUtil from '@/utils/HttpUtil'
import moment from 'moment';
const remote = require('electron').remote
export default {
  name: "DynamicGraph",
  components: {},
  props: {},
  data() {
    return {
      // 镭射灯样式闪烁显示
      dengShow: true,
      // 当前上货数
      nowInNum: 0,
      // 当前下货数
      nowOutNum: 0,
      // 各个区域下箱子数组
      arrAB: [],
      arrBC: [],
      arrCD: [],
      arrDE: [],
      arrEI: [],
      arrGH: [],
      arrJK: [],
      arrF: [], // 下货队列
      // 每个点位的值，根据收到PLC指令为准，值为1或0
      pointA: '0',
      pointB: '0',
      pointC: '0',
      pointD: '0',
      pointE: '0',
      pointF: '0',
      pointG: '0',
      pointH: '0',
      pointI: '0',
      pointJ: '0',
      pointK: '0',
      // 控制拖动传送带抽屉弹窗是否显示和隐藏
      drawer: false,
      // 当前点击的传送带区域内的箱子列表，一个中间变量
      boxArr: [],
      // 当前打开的是哪块传送带队列
      traAB: false,
      traBC: false,
      traCD: false,
      traDE: false,
      traEI: false,
      traF: false,
      traGH: false,
      traJK: false,
      // 当前被拖动元素的索引
      dragIndex: '',
      // PLC光电状态数组
      guangDianStatusArr: '',
      // PLC点击状态数组
      dianJiStatusArr: '',
      // 当前运行订单对象
      orderMainDy: {},
      // 束下实际数据
      lightBeamRealTimeSpeed: 0,
      // 是否正在进入A点
      enteringPonitA: false,
      // 是否正在进入B点
      enteringPonitB: false,
      // 是否正在进入E点
      enteringPonitE: false,
      // 是否正在进入C点
      enteringPonitC: false,
      // 上料固定扫码
      loadScanCode: '',
      // 上料固定扫码(实时读PLC的码)
      loadScanCodeTemp: '',
      // 迷宫出口固定扫码
      labyrinthScanCode: '',
      // 迷宫出口固定扫码(实时读PLC的码)
      labyrinthScanCodeTemp: '',
      // l11长度，取配置
      l11: 0,
      // l2长度，取配置
      l2: 0,
      // 最后一个经过H点箱子的id，用于获取当前经过E点箱子的模拟id
      lastRouteHPoint: '',
      // 最后一个经过F点箱子的id，用于获取当前经过E点箱子的模拟id
      lastRouteFPoint: '',
      // 下货预警标识
      yujingShow: false,
      // 下货报警标识
      baojingShow: false,
      // 上货id信息（显示在页面上）
      nowABoxImitateId: '',
      // 下货id信息（显示在页面上）
      nowEBoxImitateId: '',
      nowShuXiaid: '', // 当前束下ID 清空
      nowTiChuNum: 0, // 当前剔除的数量，清空
      beginCountNum: 0, // 模拟id开始数，清空
      logArr: [], // 输送线运行日志
      errorLogArr: [], // PLC报警日志
      banLoadStatus: false, // 是否禁止上货
      judgeBanLoadBoxImitateId: '', // 到达判断禁止上货点位后，需要判断的箱子id
      ifNextPassABoxIsFirst: true, // 刚开始时，第一个经过A点的箱子一定是第一个
      lastNewBoxPassABoxImitateId: '', // 新增的箱子，最后一个经过A点的模拟Id
      err1: '', // PLC报警1
      err2: '', // PLC报警2
      err3: '', // PLC报警3
      err4: '', // PLC报警4
      err5: '', // PLC报警5
      err6: '', // PLC报警6
      err7: '', // PLC报警7
      err8: '', // PLC报警8
      err9: '', // PLC报警9
      err10: '', // PLC报警10
      logPageFlag: 'log', // 日志是显示传送带运行日常日志还是报警日志
      fullPause: false,
      fullRun: false,
      fullStop: false,
      judgeSpeedInterval: null, // 工艺对比添加 束下实际速度与设定速度对比，不合格报警 DBW4 加速器允许货物进入辐照区
      shuxiaSpeedProportion: 1, // 束下前输送速度比
      logNotReadNumber: 0, // 日志未读数量
      errorLogNotReadNumber: 0, // 错误日志未读数量
      abTipShow: false,
      bcTipShow: false,
      cdTipShow: false,
      deTipShow: false,
      eiTipShow: false,
      ghTipShow: false,
      jkTipShow: false,
      fTipShow: false,
      nowLoadingBatch: 0,
      isSendCenter: false
    };
  },
  watch: {
    pointA: {
      async handler(newVal, oldVal) {
        if(!this.enteringPonitA && newVal === '1' && oldVal === '0') { //货物开始进入A点
          // 碰到A，清零读码信息
          this.loadScanCode = ''
          this.enteringPonitA = true
          // 新增，按照要求生成模拟id策略
          const boxImitateId = await this.getCurrentTimeSort();
          this.nowABoxImitateId = boxImitateId;
          // 代表货物进入光电A，生成模拟id绑定,如果有扫码数据则
          this.arrAB.push({orderId: this.orderMainDy.orderId, orderNo: this.orderMainDy.orderNo, boxImitateId: boxImitateId, numberTurns: 1, loadScanCode: this.loadScanCode, turnsInfoList:[{numberTurns: 1, passATime: moment().format('YYYY-MM-DD HH:mm:ss')}]});
          // 判断当前箱子是不是当前批次消毒的第一个
          if(this.ifNextPassABoxIsFirst) {
            this.nowLoadingBatch++;
            this.judgeBanLoadBoxImitateId = boxImitateId;
            this.ifNextPassABoxIsFirst = false; // 设置为false,下一个经过A点的箱子绝不是此批次第一个箱子了
          }
          // 新增的箱子，最后一个经过A点的模拟Id
          this.lastNewBoxPassABoxImitateId = boxImitateId;
          // 新上货物时，报警和预警先关闭
          this.yujingShow = false;
          this.baojingShow = false;
          // 上货数量+1
          this.nowInNum++;
          // 模拟id数+1
          this.beginCountNum++;
          // 生成日志
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + boxImitateId + '进入A点', 'log');
        } else if(this.enteringPonitA && newVal === '0' && oldVal === '1') { // 货物走出A点
          this.enteringPonitA = false
          if(this.arrAB[this.arrAB.length - 1] != undefined) {
            this.dealBoxLogic('A')
          }
        } else {
          // 先暂定报警吧，因为肯定不会出现这种情况，出现了视为异常，不做任何处理
          alert('异常！程序走到一个不该走到的地方！')
        }
      }
    },
    pointB: {
      handler(newVal, oldVal) {
        // enteringPonitB
        if(!this.enteringPonitB && newVal === '1' && oldVal === '0') { //货物开始进入B点
          this.enteringPonitB = true
        } else if(this.enteringPonitB && newVal === '0' && oldVal === '1') { // 货物走出B点
          this.enteringPonitB = false
          if(this.arrAB.length > 0) {
            this.dealBoxLogic('B')
          }
        } else {
          // 先暂定报警吧，因为肯定不会出现这种情况，出现了视为异常，不做任何处理
          alert('异常！程序走到一个不该走到的地方！')
        }
      }
    },
    pointC: {
      handler(newVal, oldVal) {
        // enteringPonitC
        if(!this.enteringPonitC && newVal === '1' && oldVal === '0') { //货物开始进入c点
          this.enteringPonitC = true
          // 这个时间判断变成C点了 一会把他安排上
          if(this.arrBC.length > 0) {
            this.$message.success('开始进入C点')
            // 进入C的下降沿，获取BC队列第一个，开始计算时间，到时间后，进行工艺对比，判断货物是否合格
            const boxImitateId = this.arrBC[0].boxImitateId;
            // 计算时间
            setTimeout(() => {
              this.getUndercutProcess(boxImitateId);
            }, 2000);
            // 当上一批次的最后一箱经过C时才能允许下一批次的进入A，解锁A，允许上货
            // 判断是否满足可上货条件，就是当前这批消毒的箱子，最后一个满足圈数并且离开A，即可上货
            if(this.arrBC[0].boxImitateId == this.lastNewBoxPassABoxImitateId) {
              if(this.arrBC[0].numberTurns == this.orderMainDy.numberTurns) {
                this.ifNextPassABoxIsFirst = true;
                this.banLoadStatus = false; // 隐藏禁止上货图标
                this.judgeBanLoadBoxImitateId = ''
                // 给PLC发送允许上货命令
                ipcRenderer.send('writeValuesToPLC', 'DBW36', 1);
              }
            }
            // 当更换第二批次的第一箱进到达C时，输出一个自动调节居中机构信号。设备A-C回停机自动等待居中机构调整完再启动进入CD队列。
            if(this.nowLoadingBatch == 2 && this.arrBC[0].boxImitateId == this.judgeBanLoadBoxImitateId && !this.isSendCenter) {
              this.isSendCenter = true
              this.$message.success('发送自动调节居中机构信号！')
              // 给PLC发送禁止上货指令
              ipcRenderer.send('writeValuesToPLC', 'DBW40', 1);
            }
          }
        } else if(this.enteringPonitC && newVal === '0' && oldVal === '1') { // 货物走出c点
          this.enteringPonitC = false
          if(this.arrBC.length > 0) {
          this.dealBoxLogic('C')
        }
        } else {
          // 先暂定报警吧，因为肯定不会出现这种情况，出现了视为异常，不做任何处理
          alert('异常！程序走到一个不该走到的地方！')
        }
      }
    },
    pointD: {
      handler(newVal, oldVal) {
        if(this.arrCD.length > 0) {
          this.dealBoxLogic('D')
        }
      }
    },
    pointE: {
      handler(newVal, oldVal) {
        // 进入E点的，剔除不合格的箱子，给PLC发送剔除指令
        // enteringPonitE
        if(!this.enteringPonitE && newVal === '1' && oldVal === '0') { //货物开始进入B点
          this.enteringPonitE = true
          if(this.arrDE.length > 0) {
            // 进入E点，清空读码信息
            this.labyrinthScanCode = '';
            this.$message.warning('货物进入E点')
            this.dealBoxLogic('E')
          }
        } else if(this.enteringPonitE && newVal === '0' && oldVal === '1') { // 货物走出B点
          this.$message.warning('货物走出E点')
          this.enteringPonitE = false
          if(this.arrDE.length > 0) {
            // 走出E点，读码
            this.labyrinthScanCode = this.labyrinthScanCodeTemp.replace(/\s/g,'');
            this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + '货物' + this.arrDE[0].boxImitateId + '走出E点，扫码信息：' + this.labyrinthScanCode, 'log');
            // 把箱子推入EI队列
            this.arrEI.push(this.arrDE[0]);
            this.arrDE.splice(0,1)
          }
        } else {
          // 先暂定报警吧，因为肯定不会出现这种情况，出现了视为异常，不做任何处理
          alert('异常！程序走到一个不该走到的地方！')
        }
      }
    },
    pointF: {
      handler(newVal, oldVal) {
        if(this.arrEI.length > this.nowTiChuNum) {
          this.dealBoxLogic('F')
        }
      }
    },
    pointG: {
      handler(newVal, oldVal) {
        if(this.arrEI.length > this.nowTiChuNum) {
          this.dealBoxLogic('G')
        }
      }
    },
    pointH: {
      handler(newVal, oldVal) {
        if(this.arrGH.length > 0) {
          this.dealBoxLogic('H')
        }  
      }
    },
    pointI: {
      handler(newVal, oldVal) {
        if(this.arrEI.length > this.nowTiChuNum) {
          this.dealBoxLogic('I')
        }  
      }
    },
    pointJ: {
      handler(newVal, oldVal) {
        if(this.arrEI.length > this.nowTiChuNum) {
          this.dealBoxLogic('J')
        }  
      }
    },
    pointK: {
      handler(newVal, oldVal) {
        if(this.arrJK.length > 0) {
          this.dealBoxLogic('K')
        }  
      }
    },
    err1: {
      handler(newVal, oldVal){
        if(newVal == '1') {
          // 输送线上线急停被按下
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 输送线上线急停被按下!', 'error')
        }
      }
    },
    err2: {
      handler(newVal, oldVal){
        if(newVal == '1') {
          // 输送线下线急停被按下
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 输送线下线急停被按下!', 'error')
        }
      }
    },
    err3: {
      handler(newVal, oldVal){
        if(newVal == '1') {
          // 输送线电箱急停被按下
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 输送线电箱急停被按下!', 'error')
        }
      }
    },
    err4: {
      handler(newVal, oldVal){
        if(newVal == '1') {
          // 输送线进线变频过载
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 输送线进线变频过载!', 'error')
        }
      }
    },
    err5: {
      handler(newVal, oldVal){
        if(newVal == '1') {
          // 束下输送线进线变频过载
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 束下输送线进线变频过载!', 'error')
        }
      }
    },
    err6: {
      handler(newVal, oldVal){
        if(newVal == '1') {
          // 输送线出线变频过载
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 输送线出线变频过载!', 'error')
        }
      }
    },
    err7: {
      handler(newVal, oldVal){
        if(newVal == '1') {
          // 翻转机故障报警
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 翻转机故障报警!', 'error')
        }
      }
    },
    err8: {
      handler(newVal, oldVal){
        if(newVal == '1') {
          // 剔除机构故障报警
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 剔除机构故障报警!', 'error')
        }
      }
    },
    err9: {
      handler(newVal, oldVal){
        if(newVal == '1') {
          // 束下进货堵料
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 束下进货堵料!', 'error')
        }
      }
    },
    err10: {
      handler(newVal, oldVal){
        if(newVal == '1') {
          // 束下出货堵料
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 束下出货堵料!', 'error')
        }
      }
    }
  },
  computed: {},
  methods: {
    createLog(msg, type) {
      if(type == 'log') {
        // 生成日志
        this.logArr.push({text: msg})
        this.$nextTick(() => {
          this.scrollToBottom();
        });
        // 如果当前日志在显示的是报警列表，运行日志有新日志要徽标提示
        if(this.logPageFlag == 'error-log') {
          this.logNotReadNumber++;
        }
      } else {
        this.errorLogArr.push({text: msg})
        // 如果当前日志在显示的是运行列表，报警日志有新日志要徽标提示
        if(this.logPageFlag == 'error-log') {
          this.errorLogNotReadNumber++;
        }
      }
    },
    scrollToBottom() {
      const logContainer = this.$refs.logContainer;
      // logContainer.scrollTop = logContainer.scrollHeight;
      logContainer.scrollTo({
        top: logContainer.scrollHeight,
        behavior: "smooth"
      });
    },
    qualified4Box(boxImitateIdVal, status) {
      //判断箱子在哪个队列 AB BC CD DG GH,status为true为合格，false为不合格
      for (let index = 0; index < this.arrCD.length; index++) {
        if(this.arrCD[index].boxImitateId == boxImitateIdVal) {
          this.arrCD[index].qualified = status?'1':'0';
          // 给当前圈也赋值合格
          this.arrCD[index].turnsInfoList[this.arrCD[index].numberTurns - 1].qualified = status?'1':'0';
          break;
        }
      }
    },
    judgeAccData(accData, boxImitateIdVal) {
      // 判断束流 beam
      console.log(accData.beam)
      if(accData.beam != undefined && accData.beam != null && accData.beam != '') {
        if (Number(this.orderMainDy.slLowerLimit) > Number(accData.beam) || Number(this.orderMainDy.slUpperLimit) < Number(accData.beam)) {
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + boxImitateIdVal + '工艺不合格！束流设定最小值：' + this.orderMainDy.slLowerLimit + '，束流设定最大值：' + this.orderMainDy.slUpperLimit + '，束流读取值：' + accData.beam, 'log');
          return false;
        } 
      } else {
        this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + boxImitateIdVal + '工艺不合格！束流设定最小值：' + this.orderMainDy.slLowerLimit + '，束流设定最大值：' + this.orderMainDy.slUpperLimit + '，束流读取值：' + accData.beam, 'log');
        return false;
      }
      // 判断功率 power
      // console.log(accData.power)
      if(accData.power != undefined && accData.power != null && accData.power != '') {
        if (Number(this.orderMainDy.glLowerLimit) > Number(accData.power) || Number(this.orderMainDy.glUpperLimit) < Number(accData.power)) {
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + boxImitateIdVal + '工艺不合格！功率设定最小值：' + this.orderMainDy.glLowerLimit + '，功率设定最大值：' + this.orderMainDy.glUpperLimit + '，功率读取值：' + accData.power, 'log');
          return false;
        } 
      } else {
        this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + boxImitateIdVal + '工艺不合格！功率设定最小值：' + this.orderMainDy.glLowerLimit + '，功率设定最大值：' + this.orderMainDy.glUpperLimit + '，功率读取值：' + accData.power, 'log');
        return false;
      }
      // 判断扫宽 scanW
      // console.log(accData.scanW)
      if(accData.scanW != undefined && accData.scanW != null && accData.scanW != '') {
        if (Number(this.orderMainDy.skLowerLimit) > Number(accData.scanW) || Number(this.orderMainDy.skUpperLimit) < Number(accData.scanW)) {
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + boxImitateIdVal + '工艺不合格！扫宽设定最小值：' + this.orderMainDy.skLowerLimit + '，扫宽设定最大值：' + this.orderMainDy.skUpperLimit + '，扫宽读取值：' + accData.scanW, 'log');
          return false;
        } 
      } else {
        this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + boxImitateIdVal + '工艺不合格！扫宽设定最小值：' + this.orderMainDy.skLowerLimit + '，扫宽设定最大值：' + this.orderMainDy.skUpperLimit + '，扫宽读取值：' + accData.scanW, 'log');
        return false;
      }
      // 判断扫描频率 scanF
      // console.log(accData.scanF)
      if(accData.scanF != undefined && accData.scanF != null && accData.scanF != '') {
        if (Number(this.orderMainDy.smplLowerLimit) > Number(accData.scanF) || Number(this.orderMainDy.smplUpperLimit) < Number(accData.scanF)) {
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + boxImitateIdVal + '工艺不合格！扫描频率设定最小值：' + this.orderMainDy.smplLowerLimit + '，扫描频率设定最大值：' + this.orderMainDy.smplUpperLimit + '，扫描频率读取值：' + accData.scanF, 'log');
          return false;
        } 
      } else {
        this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + boxImitateIdVal + '工艺不合格！扫描频率设定最小值：' + this.orderMainDy.smplLowerLimit + '，扫描频率设定最大值：' + this.orderMainDy.smplUpperLimit + '，扫描频率读取值：' + accData.scanF, 'log');
        return false;
      }
      // 判断PFN电压 pfn
      // console.log(accData.pfn)
      if(accData.pfn != undefined && accData.pfn != null && accData.pfn != '') {
        if (Number(this.orderMainDy.pfnLowerLimit) > Number(accData.pfn) || Number(this.orderMainDy.pfnUpperLimit) < Number(accData.pfn)) {
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + boxImitateIdVal + '工艺不合格！PFN电压设定最小值：' + this.orderMainDy.pfnLowerLimit + '，PFN电压设定最大值：' + this.orderMainDy.pfnUpperLimit + '，PFN电压读取值：' + accData.pfn, 'log');
          return false;
        } 
      } else {
        this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + boxImitateIdVal + '工艺不合格！PFN电压设定最小值：' + this.orderMainDy.pfnLowerLimit + '，PFN电压设定最大值：' + this.orderMainDy.pfnUpperLimit + '，PFN电压读取值：' + accData.pfn, 'log');
        return false;
      }
      // 判断能量 energy
      // console.log(accData.energy)
      if(accData.energy != undefined && accData.energy != null && accData.energy != '') {
        if (Number(this.orderMainDy.nlLowerLimit) > Number(accData.energy) || Number(this.orderMainDy.nlUpperLimit) < Number(accData.energy)) {
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + boxImitateIdVal + '工艺不合格！能量设定最小值：' + this.orderMainDy.nlLowerLimit + '，能量设定最大值：' + this.orderMainDy.nlUpperLimit + '，能量读取值：' + accData.energy, 'log');
          return false;
        } 
      } else {
        this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + boxImitateIdVal + '工艺不合格！能量设定最小值：' + this.orderMainDy.nlLowerLimit + '，能量设定最大值：' + this.orderMainDy.nlUpperLimit + '，能量读取值：' + accData.energy, 'log');
        return false;
      }
      // 判断束下速度 speed
      // console.log(accData.speed)
      if(accData.speed != undefined && accData.speed != null && accData.speed != '') {
        if (Number(this.orderMainDy.sxSpeedLowerLimit) > Number(accData.speed) || Number(this.orderMainDy.sxSpeedUpperLimit) < Number(accData.speed)) {
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + boxImitateIdVal + '工艺不合格！束下速度设定最小值：' + this.orderMainDy.sxSpeedLowerLimit + '，束下速度设定最大值：' + this.orderMainDy.sxSpeedUpperLimit + '，束下速度读取值：' + accData.speed, 'log');
          return false;
        } 
      } else {
        return false;
      }
      this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + boxImitateIdVal + '工艺合格！', 'log');
      return true;
    },
    // 拿到模拟id去判断箱子的工艺是否合格
    getUndercutProcess(boxImitateIdVal) {
      this.nowShuXiaid = boxImitateIdVal;
      // 获取当前加速器工艺，和系统设置工艺做比较
      HttpUtil.get('/box/getAccData').then((res)=> {
        console.log(res)
        // 给当前箱子赋值acc读取值
        const index = this.arrCD.findIndex(item => {
          return item.boxImitateId === boxImitateIdVal
        })
        if(index != -1) {
          // 给箱子设置读取值
          this.arrCD[index].turnsInfoList[this.arrCD[index].numberTurns - 1].slRead = res.data.beam;
          this.arrCD[index].turnsInfoList[this.arrCD[index].numberTurns - 1].glRead = res.data.power;
          this.arrCD[index].turnsInfoList[this.arrCD[index].numberTurns - 1].skRead = res.data.scanW;
          this.arrCD[index].turnsInfoList[this.arrCD[index].numberTurns - 1].smplRead = res.data.scanF;
          this.arrCD[index].turnsInfoList[this.arrCD[index].numberTurns - 1].pfnRead = res.data.pfn;
          this.arrCD[index].turnsInfoList[this.arrCD[index].numberTurns - 1].nlRead = res.data.energy;
          this.arrCD[index].turnsInfoList[this.arrCD[index].numberTurns - 1].sxSpeedRead = res.data.speed;
        }
        if(res.data&&JSON.stringify(this.orderMainDy) != '{}' && this.judgeAccData(res.data, boxImitateIdVal)) {
          this.$message({
            type: 'success',
            message: '箱子id' + boxImitateIdVal + '工艺合格！更新状态！'
          });
          this.qualified4Box(boxImitateIdVal, true)
        } else {
          this.$message({
            type: 'warning',
            message: '箱子id' + boxImitateIdVal + '工艺不合格！更新状态！'
          });
          this.qualified4Box(boxImitateIdVal, false)
        }
      }).catch((err)=> {
        this.$message({
          type: 'warning',
          message: '箱子id' + boxImitateIdVal + '工艺不合格！更新状态！'
        });
        this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + boxImitateIdVal + '工艺不合格！数据异常，未读取到加速器数值！', 'log');
        this.qualified4Box(boxImitateIdVal, false)
        console.log(err)
      });
    },
    analogOptoelectronics(point) {
      switch (point) {
        case 'A':
          this.pointA = this.pointA === '1' ? '0' : '1'
          break;
        case 'B':
          this.pointB = this.pointB === '1' ? '0' : '1'
          break;
        case 'C':
          this.pointC = this.pointC === '1' ? '0' : '1'
          break;
        case 'D':
          this.pointD = this.pointD === '1' ? '0' : '1'
          break;
        case 'E':
          this.pointE = this.pointE === '1' ? '0' : '1'
          break;
        case 'F':
          this.pointF = this.pointF === '1' ? '0' : '1'
          break;
        case 'G':
          this.pointG  = this.pointG === '1' ? '0' : '1'
          break;
        case 'H':
          this.pointH = this.pointH === '1' ? '0' : '1'
          break;
        case 'I':
          this.pointI = this.pointI === '1' ? '0' : '1'
          break;
        case 'J':
          this.pointJ = this.pointJ === '1' ? '0' : '1'
          break;
        case 'K':
          this.pointK = this.pointK === '1' ? '0' : '1'
          break;
        default:
          break;
      }
    },
    showOrderInfo(orderMain) {
      this.orderMainDy = JSON.parse(JSON.stringify(orderMain))
      this.fullRun = true;
      this.fullPause = false;
      this.fullStop = false;
      // 开始监听束下实际速度和设定速度
      this.judgeSpeedInterval = setInterval(() => {
        if(this.lightBeamRealTimeSpeed != null && this.lightBeamRealTimeSpeed != undefined && this.lightBeamRealTimeSpeed != '') {
          if((Number(this.lightBeamRealTimeSpeed) >= Number(this.orderMainDy.sxSpeedLowerLimit)) && (Number(this.lightBeamRealTimeSpeed) <= Number(this.orderMainDy.sxSpeedUpperLimit))) {
            ipcRenderer.send('writeValuesToPLC', 'DBW4', 1);
          } else {
            ipcRenderer.send('writeValuesToPLC', 'DBW4', 0);
          }
        } else {
          ipcRenderer.send('writeValuesToPLC', 'DBW4', 0);
        }
      }, 1000);
      const param = {
        orderId: this.orderMainDy.orderId,
        startTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        orderStatus: 200
      }
      // 更新订单开始时间
      HttpUtil.post('/order/update', param).then((res)=> {
        if(res.data == 1) {
          this.$message.success('更新订单开始时间成功！')
        } else {
          this.$message.error('更新订单开始时间失败！')
        }
      }).catch((err)=> {
        this.$message.success('更新订单开始时间失败！')
      });
    },
    dragStart(index) {
      // 将被拖动的元素的索引存储在数据传输对象中
      this.dragIndex = index
    },
    dropItem(zoneId, event) {
      // 防止浏览器打开拖动的元素的URL
      event.preventDefault();
      // 获取目标区域的ID
      const dropZoneId = zoneId;
      // 执行不同的逻辑，根据目标区域的ID
      // 判断拖拽的是哪个数组的
      switch (dropZoneId) {
        case 'AB':
          this.arrAB.push(this.boxArr[this.dragIndex]);
          this.$notify({
            title: '移动成功！',
            message: '成功移至A-B队列',
            position: 'top-left',
            offset: 70,
            duration:0,
            type: 'success'
          });
          break;
        case 'BC':
          this.arrBC.push(this.boxArr[this.dragIndex]);
          this.$notify({
            title: '移动成功！',
            message: '成功移至B-C队列',
            position: 'top-left',
            offset: 70,
            duration:0,
            type: 'success'
          });
          break;
        case 'CD':
          this.arrCD.push(this.boxArr[this.dragIndex]);
          this.$notify({
            title: '移动成功！',
            message: '成功移至C-D队列',
            position: 'top-left',
            offset: 70,
            duration:0,
            type: 'success'
          });
          break;
        case 'DE':
          this.arrDE.push(this.boxArr[this.dragIndex]);
          this.$notify({
            title: '移动成功！',
            message: '成功移至D-E队列',
            position: 'top-left',
            offset: 70,
            duration:0,
            type: 'success'
          });
          break;
        case 'F':
          this.arrF.push(this.boxArr[this.dragIndex]);
          this.$notify({
            title: '移动成功！',
            message: '成功移至F队列',
            position: 'top-left',
            offset: 70,
            duration:0,
            type: 'success'
          });
          break;
        case 'EI':
          this.arrEI.push(this.boxArr[this.dragIndex]);
          this.$notify({
            title: '移动成功！',
            message: '成功移至EI队列',
            position: 'top-left',
            offset: 70,
            duration:0,
            type: 'success'
          });
          break;
        case 'GH':
          this.arrGH.push(this.boxArr[this.dragIndex]);
          this.$notify({
            title: '移动成功！',
            message: '成功移至G-H队列',
            position: 'top-left',
            offset: 70,
            duration:0,
            type: 'success'
          });
          break;
        case 'JK':
          this.arrJK.push(this.boxArr[this.dragIndex]);
          this.$notify({
            title: '移动成功！',
            message: '成功移至J-K队列',
            position: 'top-left',
            offset: 70,
            duration:0,
            type: 'success'
          });
          break;
        default:
          break;
      }
      this.boxArr.splice(this.dragIndex,1);
      // 出去拖动背景色
      const draggingRows = document.querySelectorAll(".transform-card.hover");
      console.log(draggingRows)
      draggingRows.forEach(row => {
        row.classList.remove("hover");
      });
    },
    dragEnter(event) {
      event.preventDefault();
      event.stopPropagation();
      event.target.classList.add('hover');
    },
    dragLeave(event) {
      event.preventDefault();
      event.stopPropagation();
      event.target.classList.remove('hover');
    },
    indexMethod(index) {
      return index + 1;
    },
    showCache(transform) {
      this.traAB = false;
      this.traBC = false;
      this.traCD = false;
      this.traDE = false;
      this.traEI = false;
      this.traGH = false;
      this.traJK = false;
      this.traF = false;
      switch (transform) {
        case 'AB':
          this.boxArr = this.arrAB;
          this.traAB = true
          break;
        case 'BC':
          this.boxArr = this.arrBC;
          this.traBC = true
          break;
        case 'CD':
          this.boxArr = this.arrCD;
          this.traCD = true
          break;
        case 'DE':
          this.boxArr = this.arrDE;
          this.traDE = true
          break;
        case 'EI':
          this.boxArr = this.arrEI;
          this.traEI = true
          break;
        case 'GH':
          this.boxArr = this.arrGH;
          this.traGH = true
          break;
        case 'JK':
          this.boxArr = this.arrJK;
          this.traJK = true
          break;
        case 'F':
          this.boxArr = this.arrF;
          this.traF = true
          break;
        default:
          break;
      }
    },
    showChuanSong(transform) {
      this.drawer = true
      this.showCache(transform);
    },
    async getCurrentTimeSort() {
      const date = new Date();//当前时间
      const month = this.zeroFill(date.getMonth() + 1);//月
      const day = this.zeroFill(date.getDate());//日
      return date.getFullYear() + '' + month + '' + day + String(this.beginCountNum + 1).padStart(4, '0');
    },
    zeroFill(i){
      if (i >= 0 && i <= 9) {
      return '0' + i;
      } else {
      return i;
      }
    },
    async dealBoxLogic(point) {
      // 这些判断逻辑都不对，得改，因为point*都是在随时变化的，万一变化速度快，从1变0，那么就会丢失这次光电触发状态
      // 正确修改方法：直接在watch方法判断值，一变化接着调用这个方法，并且传固参，不再判断point*变量
      switch (point) {
        case 'A':
          this.loadScanCode = this.loadScanCodeTemp.replace(/\s/g,'');
          this.arrAB[this.arrAB.length - 1].loadScanCode = this.loadScanCode;
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + this.arrAB[this.arrAB.length - 1].boxImitateId + '离开A点，扫码信息：' + this.loadScanCode, 'log');
          break;
        case 'B':
          // 把AB队列第一个货物出列，进入BC
          this.arrBC.push(this.arrAB[0]);
          // BC刚进队列的箱子，设置 经过B点的时间
          this.arrBC[this.arrBC.length - 1].turnsInfoList[this.arrBC[this.arrBC.length - 1].numberTurns - 1].passBTime = moment().format('YYYY-MM-DD HH:mm:ss');
          // 删除AB队列第一个
          this.arrAB.splice(0,1)
          // 生成日志
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + this.arrBC[this.arrBC.length - 1].boxImitateId + '经过B点，扫码信息：' + this.arrBC[this.arrBC.length - 1].loadScanCode, 'log');
          break;
        case 'C':
          this.arrCD.push(this.arrBC[0]);
          this.arrCD[this.arrCD.length - 1].turnsInfoList[this.arrCD[this.arrCD.length - 1].numberTurns - 1].passCTime = moment().format('YYYY-MM-DD HH:mm:ss');
          // 删除BC队列第一个
          this.arrBC.splice(0,1);
          this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + this.arrCD[this.arrCD.length - 1].boxImitateId + '经过C点，扫码信息：' + this.arrCD[this.arrCD.length - 1].loadScanCode, 'log');
          break;
        case 'D':
          if(this.pointD === '1') {
            // 把CD队列第一个货物出列，进入DG
            this.arrDE.push(this.arrCD[0]);
            this.arrDE[this.arrDE.length - 1].turnsInfoList[this.arrDE[this.arrDE.length - 1].numberTurns - 1].passDTime = moment().format('YYYY-MM-DD HH:mm:ss');
            // 删除BC队列第一个
            this.arrCD.splice(0,1);
            this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + this.arrDE[this.arrDE.length - 1].boxImitateId + '经过D点，扫码信息：' + this.arrDE[this.arrDE.length - 1].loadScanCode, 'log');
          }
          break;
        case 'E':
          // 判断进入E点的箱子工艺是否合格，合格不做处理，不合格剔除
          // 判断是不是符合禁止上货条件
          if(this.arrDE[0].boxImitateId == this.judgeBanLoadBoxImitateId) {
            // 如果是下一批第一个箱子经过E，则取消下货预警和报警
            this.yujingShow = false;
            this.baojingShow = false;
            // 显示禁止上货图标
            this.banLoadStatus = true;
            // 给PLC发送禁止上货指令
            ipcRenderer.send('writeValuesToPLC', 'DBW26', 1);
          }
          this.nowEBoxImitateId = this.arrDE[0].boxImitateId;
          // 更新进入E点时间
          this.arrDE[0].turnsInfoList[this.arrDE[0].numberTurns - 1].passETime = moment().format('YYYY-MM-DD HH:mm:ss');
          if(this.arrDE[0].qualified === '0') {
            // 执行剔除命令
            ipcRenderer.send('writeValuesToPLC', 'DBW18', 1);
            this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + '货物' + this.arrDE[0].boxImitateId + '经过E点,货物不合格！执行剔除命令！', 'log');
            // 给箱子标记剔除标识
            this.arrDE[0].tichuFlag = true;
          } else {
            ipcRenderer.send('writeValuesToPLC', 'DBW18', 0);
            this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + '货物' + this.arrDE[0].boxImitateId + '经过E点,货物合格！', 'log');

            // 合格需要判断是回流、翻转、还是下货。判断是否符合下货条件。
            if (this.arrDE[0].numberTurns >= this.orderMainDy.numberTurns) {
              // 符合下货条件，展示预警，货物需要下线标识。
              this.yujingShow = true;
              // 发送下货指令
              ipcRenderer.send('writeValuesToPLC', 'DBW16', 1);
              this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + '货物' + this.arrDE[0].boxImitateId + '经过E点,货物合格！符合下货条件，执行下货命令！', 'log');
              // 给箱子标记下货标识
              this.arrDE[0].xiahuoFlag = true;
            } else {
              // 如果是翻转进入GH队列，不翻转进入JK队列
              if(this.orderMainDy.revertFlag == '翻转') {
                this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + '货物' + this.arrDE[0].boxImitateId + '经过E点,货物合格！执行翻转命令！', 'log');
                ipcRenderer.send('writeValuesToPLC', 'DBW12', 1);
              } else {
                this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + '货物' + this.arrDE[0].boxImitateId + '经过E点,货物合格！执行回流命令！', 'log');
                ipcRenderer.send('writeValuesToPLC', 'DBW14', 1);
              }
            }
          }
          break;
        case 'F':
          if(this.pointF === '1') {
            // 下货，判断箱子是否有下货标识 nowTiChuNum当前剔除数量
            if(this.arrEI.length > this.nowTiChuNum) {
              // 取EI队列，除去剔除的第一个箱子，判断是否有下货标识
              if(this.arrEI[this.nowTiChuNum].xiahuoFlag) {
                // 符合进入F队列
                this.arrF.push(this.arrEI[this.nowTiChuNum]);
                this.arrF[this.arrF.length - 1].turnsInfoList[this.arrF[this.arrF.length - 1].numberTurns - 1].passFTime = moment().format('YYYY-MM-DD HH:mm:ss');
                this.arrEI.splice(this.nowTiChuNum,1);
                this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + this.arrF[this.arrF.length - 1].boxImitateId + '经过F点，扫码信息：' + this.arrF[this.arrF.length - 1].loadScanCode, 'log');
                // 生成箱报告
                this.nowOutNum++;
                const param = {
                  boxMainDTOList: [this.arrF[this.arrF.length - 1]],
                  finishOrder: false
                }
                // 生成箱报告
                await HttpUtil.post('/box/save', param).then((res)=> {
                  if(res.data == 1) {
                    this.$message.success('货物：' + this.arrF[this.arrF.length - 1].boxImitateId + '，已生成箱报告！')
                    this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + this.arrF[this.arrF.length - 1].boxImitateId + '，已生成箱报告！', 'log');
                  } else {
                    this.$message.error('货物：' + this.arrF[this.arrF.length - 1].boxImitateId + '，生成箱报告失败！')
                    this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + this.arrF[this.arrF.length - 1].boxImitateId + '，生成箱报告失败！', 'log');
                  }
                }).catch((err)=> {
                  this.$message.error('货物：' + this.arrF[this.arrF.length - 1].boxImitateId + '，生成箱报告失败！' + err)
                  this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + this.arrF[this.arrF.length - 1].boxImitateId + '，生成箱报告失败！' + err, 'log');
                });
              }
            }
          }
          break;
        case 'G':
          if(this.pointG === '1') {
            if(this.arrEI.length > this.nowTiChuNum) {
              this.arrGH.push(this.arrEI[this.nowTiChuNum]);
              this.arrGH[this.arrGH.length - 1].turnsInfoList[this.arrGH[this.arrGH.length - 1].numberTurns - 1].passGTime = moment().format('YYYY-MM-DD HH:mm:ss');
              this.arrEI.splice(this.nowTiChuNum,1);
              this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + this.arrGH[this.arrGH.length - 1].boxImitateId + '经过F点，扫码信息：' + this.arrGH[this.arrGH.length - 1].loadScanCode, 'log');
            }
          }
          break;
        case 'H':
          if(this.pointH === '1') {
            if(this.arrGH.length > 0) {
              this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + this.arrGH[0].boxImitateId + '经过H点，扫码信息：' + this.arrGH[0].loadScanCode + '。当前 ' + this.arrGH[0].numberTurns + ' 圈，剩余 ' + (Number(this.orderMainDy.numberTurns) - Number(this.arrGH[0].numberTurns)) + ' 圈', 'log');
              // 赋值当前圈经过K点的时间
              this.arrGH[0].turnsInfoList[this.arrGH[0].numberTurns - 1].passHTime = moment().format('YYYY-MM-DD HH:mm:ss');
              // 将arrGH队列第一个进入AB队列
              this.arrAB.push(this.arrGH[0]);
              // 将arrGH队列第一个进入AB队列，箱子圈数加1
              this.arrAB[this.arrAB.length - 1].numberTurns = this.arrAB[this.arrAB.length - 1].numberTurns + 1;
              // 增加第二圈集合
              const nowTurns = this.arrAB[this.arrAB.length - 1].numberTurns;
              this.arrAB[this.arrAB.length - 1].turnsInfoList.push({numberTurns: nowTurns});
              this.arrGH.splice(0, 1);
            }
          }
          break;
        case 'I':
          // 先毙掉你 一会处理剔除队列能用到你
          if(this.pointI === '1') {
            // 剔除，判断箱子是否有剔除标识 nowTiChuNum当前剔除数量
            if(this.arrEI.length > this.nowTiChuNum) {
              // 取EI队列，除去剔除的第一个箱子，判断是否有下货标识
              if(this.arrEI[this.nowTiChuNum].tichuFlag) {
                this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + this.arrEI[this.nowTiChuNum].boxImitateId + '经过I点，扫码信息：' + this.arrEI[this.nowTiChuNum].loadScanCode + '。被剔除！', 'log');
                this.arrEI[this.nowTiChuNum].turnsInfoList[this.arrEI[this.nowTiChuNum].numberTurns - 1].passITime = moment().format('YYYY-MM-DD HH:mm:ss');
                // 生成箱报告
                const param = {
                  boxMainDTOList: [this.arrEI[this.nowTiChuNum]],
                  finishOrder: false
                }
                // 生成箱报告
                await HttpUtil.post('/box/save', param).then((res)=> {
                  if(res.data == 1) {
                    this.$message.success('货物：' + this.arrEI[this.nowTiChuNum].boxImitateId + '，已生成箱报告！')
                    this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + this.arrEI[this.nowTiChuNum].boxImitateId + '，已生成箱报告！', 'log');
                  } else {
                    this.$message.error('货物：' + this.arrEI[this.nowTiChuNum].boxImitateId + '，生成箱报告失败！')
                    this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + this.arrEI[this.nowTiChuNum].boxImitateId + '，生成箱报告失败！', 'log');
                  }
                }).catch((err)=> {
                  this.$message.error('货物：' + this.arrEI[this.nowTiChuNum].boxImitateId + '，生成箱报告失败！' + err)
                  this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + this.arrEI[this.nowTiChuNum].boxImitateId + '，生成箱报告失败！' + err, 'log');
                });
                this.nowTiChuNum++;
              }
            }
          }
          break;
        case 'J':
          if(this.pointJ === '1') {
            if(this.arrEI.length > this.nowTiChuNum) {
              this.arrJK.push(this.arrEI[this.nowTiChuNum]);
              this.arrJK[this.arrJK.length - 1].turnsInfoList[this.arrJK[this.arrJK.length - 1].numberTurns - 1].passGTime = moment().format('YYYY-MM-DD HH:mm:ss');
              this.arrEI.splice(this.nowTiChuNum,1);
              this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + this.arrJK[this.arrJK.length - 1].boxImitateId + '经过J点，扫码信息：' + this.arrJK[this.arrJK.length - 1].loadScanCode, 'log');
            }
          }
        break;
        case 'K':
          if(this.pointK === '1') {
            if(this.arrJK.length > 0) {
              this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 货物' + this.arrJK[0].boxImitateId + '经过K点，扫码信息：' + this.arrJK[0].loadScanCode + '。当前 ' + this.arrJK[0].numberTurns + ' 圈，剩余 ' + (Number(this.orderMainDy.numberTurns) - Number(this.arrJK[0].numberTurns)) + ' 圈', 'log');
              // 赋值当前圈经过K点的时间
              this.arrJK[0].turnsInfoList[this.arrJK[0].numberTurns - 1].passKTime = moment().format('YYYY-MM-DD HH:mm:ss');
              // 将arrJK队列第一个进入AB队列，
              this.arrAB.push(this.arrJK[0]);
              // 将arrGH队列第一个进入AB队列，箱子圈数加1
              this.arrAB[this.arrAB.length - 1].numberTurns = this.arrAB[this.arrAB.length - 1].numberTurns + 1;
              // 增加第二圈集合
              const nowTurns = this.arrAB[this.arrAB.length - 1].numberTurns;
              this.arrAB[this.arrAB.length - 1].turnsInfoList.push({numberTurns: nowTurns});
              // 删除原集合
              this.arrJK.splice(0, 1);
            }
          }
        break;
        default:
          break;
      }
    },
    closeDynamicGraphShow() {
      this.$emit('closeDynamicGraphShow')
    },
    PrefixZero(num, n) {
      return (Array(n).join(0) + num).slice(-n);
    },
    calculateMilliseconds(A, B) {
      return this.minutesToMilliseconds(Number(A) + Number(B));
    },
    minutesToMilliseconds(minutes) {
      return minutes * 60 * 1000;
    },
    sendMsgToPLC(command) {
      switch (command) {
        case 'suspend':
          ipcRenderer.send('writeValuesToPLC', 'DBW6', 1);
          this.$notify({
            title: '指令发送成功！',
            message: '全线暂停指令已成功发送！',
            type: 'success',
            duration: 2000
          });
          break;
        case 'run':
          ipcRenderer.send('writeValuesToPLC', 'DBW8', 1);
          this.$notify({
            title: '指令发送成功！',
            message: '全线启动指令已成功发送！',
            type: 'success',
            duration: 2000
          });
          break;
        case 'stop':
          // ipcRenderer.send('writeValuesToPLC', 'DBW10', 1);
          this.$emit('stopMethod', this.orderMainDy, false)
          this.$notify({
            title: '指令发送成功！',
            message: '全线停止指令已成功发送！',
            type: 'success',
            duration: 2000
          });
          break;
        default:
          break;
      }
    },
    setBeginCountNum(num) {
      this.beginCountNum = num
    },
    async generateBatchReport() {
      // 生成批报告，并且更新一下所有箱子
      const param = {
        boxMainDTOList: [...this.arrAB, ...this.arrBC, ...this.arrCD, ...this.arrDE, ...this.arrEI, ...this.arrGH, ...this.arrJK, ...this.arrF],
        finishOrder: true
      }
      await HttpUtil.post('/box/save', param).then((res)=> {
        if(res.data == 1) {
          this.fullPause = false;
          this.fullRun = false;
          this.fullStop = false;
          this.orderMainDy = {};
          this.clearAllData();
          clearInterval(this.judgeSpeedInterval);
          this.judgeSpeedInterval = null;
          this.$emit('returnGenerateBatchReport',true)
        } else {
          this.$emit('returnGenerateBatchReport',false)
        }
      }).catch((err)=> {
        this.$emit('returnGenerateBatchReport',false)
      });
    },
    adjustChildWidth() {
      const parentElement = this.$refs.parent;
      const childElement = this.$refs.child;
      const parentWidth = parentElement.offsetWidth;
      
      if (childElement.offsetWidth > parentWidth) {
        const maxScale = parentWidth / childElement.offsetWidth;
        const scale = Math.min(maxScale, 1); // 缩放倍数不超过1，即不放大
        childElement.style.transform = `scale(${scale})`;
      } else {
        childElement.style.transform = '';
      }
    },
    clearAllData() {
      // 当前上货数
      this.nowInNum = 0;
      // 当前下货数
      this.nowOutNum = 0;
      // 各个区域下箱子数组
      this.arrAB = [];
      this.arrBC = [];
      this.arrCD = [];
      this.arrDE = [];
      this.arrEI = [];
      this.arrGH = [];
      this.arrJK = [];
      this.arrF = []; // 被剔除的箱子缓存
      // 当前点击的传送带区域内的箱子列表，一个中间变量
      this.boxArr = [];
      // 当前打开的是哪块传送带队列
      this.traAB = false;
      this.traBC = false;
      this.traCD = false;
      this.traDE = false;
      this.traEI = false;
      this.traGH = false;
      this.traJK = false;
      this.traF = false;
      // 当前被拖动元素的索引
      this.dragIndex = '';
      // PLC光电状态数组
      this.guangDianStatusArr = '';
      // PLC点击状态数组
      this.dianJiStatusArr = '';
      // 是否正在进入A点
      this.enteringPonitA = false;
      // 是否正在进入B点
      this.enteringPonitB = false;
      this.lastRouteHPoint = '';
      this.lastRouteFPoint = '';
      this.yujingShow = false,
      this.baojingShow = false,
      this.nowABoxImitateId = '',
      this.nowEBoxImitateId = '',
      this.nowShuXiaid = '', // 当前束下ID 清空
      this.nowTiChuNum = 0, // 当前剔除的数量，清空
      this.beginCountNum = 0, // 模拟id开始数，清空
      this.logArr = [],
      this.banLoadStatus = false, // 是否禁止上货
      this.judgeBanLoadBoxImitateId = '', // 到达判断禁止上货点位后，需要判断的箱子id
      this.ifNextPassABoxIsFirst = true, // 刚开始时，第一个经过A点的箱子一定是第一个
      this.lastNewBoxPassABoxImitateId = '' // 新增的箱子，最后一个经过A点的模拟Id
      // 清空上料固定扫码
      this.loadScanCode = '';
      // 清空迷宫出口固定扫码
      this.labyrinthScanCode = '';
      this.$message.success('全线清空成功!')
    },
    getConfig() {
      // 查询配置
      HttpUtil.get('/cssConfig/getConfig').then((res)=> {
        if(res.data) {
          this.l11 = res.data.oneOneLength;
          this.l2 = res.data.twoLength;
        } else {
          this.$message.error('config error! 更新配置错误！')
        }
      }).catch((err)=> {
        this.$message.error('config error! 更新配置错误！')
      });
    },
    showRunlog() {
      this.logPageFlag = 'log';
      this.logNotReadNumber = 0;
    },
    showErrorlog() {
      this.logPageFlag = 'error-log';
      this.errorLogNotReadNumber = 0;
    },
    stopOrder() {
      this.fullPause = false
      this.fullRun = false
      this.fullStop = true
      clearInterval(this.judgeSpeedInterval);
      this.judgeSpeedInterval = null;
    },
    operationConfirm(command) {
      switch (command) {
        case 'suspend':
          this.$confirm('此操作将全线暂停, 是否继续?', '警告！', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.fullPause = true
            this.fullRun = false
            this.fullStop = false
            this.sendMsgToPLC('suspend');
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消操作！'
            });          
          });
          break;
        case 'run':
          this.$confirm('此操作将全线启动, 是否继续?', '警告！', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.fullPause = false
            this.fullRun = true
            this.fullStop = false
            this.sendMsgToPLC('run');
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消操作！'
            });          
          });
          break;
        case 'stop':
          this.$confirm('此操作将全线停止, 是否继续?', '警告！', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.fullPause = false
            this.fullRun = false
            this.fullStop = true
            clearInterval(this.judgeSpeedInterval);
            this.judgeSpeedInterval = null;
            this.sendMsgToPLC('stop');
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消操作！'
            });          
          });
          break;
        case 'clear':
          this.$prompt('请输入登录账号的密码：', '敏感操作！验证用户！', {
            confirmButtonText: '验证',
            cancelButtonText: '取消',
            inputType: 'password'
          }).then(({ value }) => {
            // 验证姓名是否正确
            const param = {
              userPassword: value,
              userCode: remote.getGlobal('sharedObject').userInfo.userCode
            }
            HttpUtil.post('/userInfo/verifyPassword', param).then((res)=> {
              if(res.data) {
                this.$message.success('验证通过！');
                this.clearAllData();
                this.createLog(moment().format('YYYY-MM-DD HH:mm:ss') + ' 用户：' + remote.getGlobal('sharedObject').userInfo.userName + '进行了全线清空操作！', 'log');
              } else {
                this.$message.error('验证未通过！');
              }
            }).catch((err)=> {
              this.$message.error('验证未通过！请重试！');
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消验证！'
            });       
          });
          break;
        default:
          break;
      }
    },
    convertToWord(value) {
      if (value < 0) {
        return (value & 0xFFFF) >>> 0; // 负数转换为无符号的16位整数
      } else {
        return value; // 非负数保持不变
      }
    },
    showAllImages(className){
      var images = document.getElementsByClassName(className);
      for (var i = 0; i < images.length; i++) {
        images[i].style.opacity = '1'; // 显示所有图片
      }
      switch (className) {
        case 'arr-ab':
          this.abTipShow = true;
          break;
        case 'arr-bc':
          this.bcTipShow = true;
          break;
        case 'arr-cd':
          this.cdTipShow = true;
          break;
        case 'arr-de':
          this.deTipShow = true;
          break;
        case 'arr-ei':
          this.eiTipShow = true;
          break;
        case 'arr-gh':
          this.ghTipShow = true;
          break;
        case 'arr-jk':
          this.jkTipShow = true;
          break;
        case 'arr-f':
          this.fTipShow = true;
          break;
        default:
          break;
      }
    },
    hideAllImages(className){
      var images = document.getElementsByClassName(className);
      for (var i = 0; i < images.length; i++) {
        images[i].style.opacity = '0'; // 隐藏所有图片
      }
      switch (className) {
        case 'arr-ab':
          this.abTipShow = false;
          break;
        case 'arr-bc':
          this.bcTipShow = false;
          break;
        case 'arr-cd':
          this.cdTipShow = false;
          break;
        case 'arr-de':
          this.deTipShow = false;
          break;
        case 'arr-ei':
          this.eiTipShow = false;
          break;
        case 'arr-gh':
          this.ghTipShow = false;
          break;
        case 'arr-jk':
          this.jkTipShow = false;
          break;
        case 'arr-f':
          this.fTipShow = false;
          break;
        default:
          break;
      }
    }
  },
  created() {
    this.getConfig()
  },
  mounted() {
    setInterval(() => {
      this.dengShow = !this.dengShow;
    }, 1000);
    // 订阅<状态球>eventBus发布的消息
    EventBus.$on('pushPLCMessage', eventData => {
      // --------无PLC测试时，这里以下代码毙掉--------
      // this.guangDianStatusArr = this.PrefixZero(this.convertToWord(eventData.DBW70).toString(2), 16);
      // this.pointA = this.guangDianStatusArr[7];
      // this.pointB = this.guangDianStatusArr[6];
      // this.pointC = this.guangDianStatusArr[5];
      // this.pointD = this.guangDianStatusArr[4];
      // this.pointE = this.guangDianStatusArr[3];
      // this.pointF = this.guangDianStatusArr[2];
      // this.pointG = this.guangDianStatusArr[1];
      // this.pointH = this.guangDianStatusArr[0];
      // this.pointI = this.guangDianStatusArr[15];
      // this.pointG = this.guangDianStatusArr[14];
      // this.pointK = this.guangDianStatusArr[13];
      // --------无PLC测试时，这里以上代码毙掉--------
      this.dianJiStatusArr = this.PrefixZero(this.convertToWord(eventData.DBW72).toString(2), 16);
      this.lightBeamRealTimeSpeed = Number(eventData.DBW68);
      // 上料固定扫码
      this.loadScanCodeTemp = eventData.DBB100??'';
      // 迷宫出口固定扫码
      this.labyrinthScanCodeTemp = eventData.DBB130??'';
      // 束下输送速度比
      // this.shuxiaSpeedProportion = Number(eventData.DBW76);
      // 监控报警日志
      if(eventData.DBW66 != null && eventData.DBW66 != undefined) {
        this.errorModArr = this.PrefixZero(this.convertToWord(eventData.DBW66).toString(2), 16);
        this.err1 = this.errorModArr[7];
        this.err2 = this.errorModArr[6];
        this.err3 = this.errorModArr[5];
        this.err4 = this.errorModArr[4];
        this.err5 = this.errorModArr[3];
        this.err6 = this.errorModArr[2];
        this.err7 = this.errorModArr[1];
        this.err8 = this.errorModArr[0];
        this.err9 = this.errorModArr[15];
        this.err10 = this.errorModArr[14];
      }
      
    })
    this.adjustChildWidth();
    window.addEventListener('resize', this.adjustChildWidth);
    // eventBus监听配置更新 reFlushConfig
    EventBus.$on('reFlushConfig', () => {
      this.getConfig();
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.adjustChildWidth);
  }
};
</script>
<style lang="less" scoped>
.dynamic {
  width: 100%;
  height: 100%;
  .card-title {
    height: 30px;
    width: 100%;
    font-weight: 550;
    letter-spacing: 0px;
    color: rgba(0, 0, 0, 1);
    text-align: left;
    vertical-align: top;
    display: flex;
    align-items: flex-end;
    padding-left: 18px;
  }
  .card-content {
    height: calc(100% - 37px);
    width: 100%;
    .data-card {
      width: 33.3333%;
      height: 33.3333%;
      float: left;
      box-sizing: border-box;
      padding: 5px 10px 5px 10px;
      &-border {
        width: 100%;
        height: 100%;
        border-radius: 20px;
        background: rgba(40, 37, 59, 1);
        box-shadow: 0px 20px 50px 0px rgba(0, 0, 0, 0.25);
        &-borderTop {
          font-weight: 400;
          letter-spacing: 0px;
          color: rgba(189, 189, 189, 1);
          text-align: left;
          vertical-align: top;
          font-size: 14px;
          line-height: 38px;
          padding-left: 14px;
        }
        .granient-text {
          background-image: linear-gradient(to right, rgba(72, 146, 254, 1) , rgba(71, 207, 245, 1));
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
        .granient-text-order {
          background-image: linear-gradient(to right, rgba(112, 225, 245, 1) , rgba(255, 209, 148, 1));
          // background-image: linear-gradient(to right, rgba(255, 95, 109, 1) , rgba(255, 195, 113, 1));
          
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
        &-borderDown {
          font-weight: 700;
          letter-spacing: 0px;
          color: rgba(255, 255, 255, 1);
          text-align: left;
          vertical-align: top;
          font-size: 28px;
          line-height: 32px;
          padding-left: 14px;
        }
      }
    }
  }
  .fusheIcon {
    width:45px;
    height:45px;
    position: absolute;
    right: 317px;
    top: -28px;
  }
  .fusheguang {
    width: 106px;
    height: 80px;
    position: absolute;
    top: 18px;
    right: 285px;
  }
  .chuansongpadding {
    box-sizing: border-box;
    .show-data-area {
      width:250px;
      height: 26px;
      position: absolute;
      &-top {
        height: 26px;
        width: 100px;
        float: left;
        display:flex;
        align-items:center;
        justify-content:center;
        font-size:15px;
        font-weight: 600;
        color: #000000;
      }
      &-content {
        height: 26px;
        width: 150px;
        float: left;
        ::v-deep .el-input--small .el-input__inner {
          text-align: center;
          font-size: 15px;
          font-weight: 600;
          color: #000000;
          height: 26px;
          line-height: 26px;
          background-color: #e5e5e5;
        }
      }
    }
    .arr-ab, .arr-bc, .arr-cd, .arr-de, .arr-ei, .arr-jk, .arr-f, .arr-gh {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      transition: opacity 0.3s ease;
    }
    .arr-ab:hover {
      opacity: 1;
    }
    .arr-ei:hover {
      opacity: 1;
    }
    .arr-jk:hover {
      opacity: 1;
    }
  }
  &-left{
    width: 820px;
    height: 100%;
    float: left;
    &-top {
      height: 384px;
      width: 100%;
      float: left;
      box-sizing: border-box;
      padding: 15px 15px 7.5px 15px;
      > div {
        width: 100%;
        height: 100%;
        opacity: 1;
        border-radius: 20px;
        background: rgba(246, 247, 251, 0.56);
        box-shadow: 0px 60px 90px 0px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(88px);
      }
    }
    &-middle {
      height: 150px;
      width: 100%;
      float: left;
      box-sizing: border-box;
      padding: 7.5px 15px 7.5px 15px;
      > div {
        width: 100%;
        height: 100%;
        opacity: 1;
        border-radius: 20px;
        background: rgba(246, 247, 251, 0.56);
        box-shadow: 0px 60px 90px 0px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(88px);
        .img {
          width: 70px;
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 20px;
          box-shadow: 18px 18px 30px rgba(0, 0, 0, 0.2),
          -15px -7px 30px rgba(255, 255, 255, 1);
          transition: all .2s ease-out;
          cursor: pointer;
          margin-left: 25px;
          font-weight: 900;
        }
        .img:active{
          cursor: pointer;
          box-shadow: 0 0 0 rgba(0, 0, 0, 0.2),
          0 0 0 rgba(255, 255, 255, 0.8),
          inset 18px 18px 30px rgba(0, 0, 0, 0.1),
          inset -18px -18px 30px rgba(255, 255, 255, 1);
        }
        .img-active{
          cursor: pointer;
          box-shadow: 0 0 0 rgba(0, 0, 0, 0.2),
          0 0 0 rgba(255, 255, 255, 0.8),
          inset 18px 18px 30px rgba(0, 0, 0, 0.1),
          inset -18px -18px 30px rgba(255, 255, 255, 1);
          color: blue;
        }
      }
    }
    &-down {
      height: calc(100% - 534px);
      width: 100%;
      float: left;
      box-sizing: border-box;
      padding: 7.5px 15px 15px 15px;
      > div {
        width: 100%;
        height: 100%;
        opacity: 1;
        border-radius: 20px;
        background: rgba(246, 247, 251, 0.56);
        box-shadow: 0px 60px 90px 0px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(88px);
        .log-class {
          cursor: pointer;
          height: 25px;
          width: 67px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .log-class:hover {
          color: #409eff;
        }
        .log-class-active {
          color: #409eff;
        }
        .log-class-active::after {
          content: "";
          position: absolute;
          left: 0;
          width: 100%;
          height: 1px; /* 调整下划线的高度 */
          background-color: #409eff; /* 调整下划线的颜色 */
        }
      }
      // 滚动槽样式定义
      ::-webkit-scrollbar {
        width: 5px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        border-radius: 10px;
      }

      ::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background-color: #28253b !important;
      }

      ::-webkit-scrollbar-thumb:window-inactive {
        background-color: #28253b !important;
      }
      .card-content {
        padding: 6px 2px 0px 2px;
        overflow: auto;
        box-sizing: border-box;
      }
      .log-text {
        line-height: 23px;
        padding-left: 18px;
        color: rgba(0, 0, 0, 1);
        margin-top: 9px;
      }
    }
  }
  &-right{
    width: calc(100% - 820px);
    // width: 100%;
    height: 100%;
    float: left;
    padding: 15px 15px 15px 0px;
    box-sizing: border-box;
    > div {
      width: 100%;
      height: 100%;
      opacity: 1;
      border-radius: 20px;
      background: rgba(246, 247, 251, 0.56);
      box-shadow: 0px 60px 90px 0px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(88px);
      background: linear-gradient(to right, rgba(83, 188, 206, 0.7), rgba(97, 168, 160, 0.8));
      .guangdian {
        width: 68px;
        height: 50px;
        position: absolute;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        * {
          border-width: 0;
        }
        .pointText {
          margin-left: 46px;
          font-size: 20px;
          color: #D43030;
        }
        .star{
          width: 0;
          height: 0;
          border-top-color: #AC33C1;
          border-left-color: transparent;
          border-right-color: transparent;
          border-top-width: 20.73px;
          border-left-width: 28.53px;
          border-right-width: 28.53px;
          border-style: solid;
          position: absolute;
          transform: scale(0.5);
        }
        .star::before {
          border-width:0; 
          content: '';
          display: block;
          width: 0;
          height: 0;
          border-top-color: #AC33C1;
          border-left-color: transparent;
          border-right-color: transparent;
          border-top-width: 20.73px;
          border-left-width: 28.53px;
          border-right-width: 28.53px;
          border-style: solid; 
          position:absolute;
          top:-20.73px;
          left:-28.53px;
          transform:rotate(72deg);
          transform-origin:28.53px  9.27px; 
        }
        .star::after{
          border-width:0; 
          content: '';
          display: block;
          width: 0;
          height: 0;
          border-top-color:#AC33C1;
          border-left-color: transparent;
          border-right-color: transparent;
          border-top-width: 20.73px;
          border-left-width: 28.53px;
          border-right-width: 28.53px;
          border-style: solid;   
          position:absolute;
          top:-20.73px;
          left:-28.53px;
          transform:rotate(-72deg);
          transform-origin:28.53px  9.27px; 
        }
      }
      .guangdian:hover {
        background: rgba(246, 247, 251, 0.56);
        box-shadow: 0px 60px 90px 0px rgba(0, 0, 0, 0.2);
      }
      .dianji {
        height: 19px;
        font-size: 15px;
        width: 75px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f56c6c;
        color: white;
        position: absolute;
      }
      .dianji-active {
        background-color: #43CF7C;
      }
      .warning-img {
        width: 161.6px;
        height: 89.74px;
        position: absolute;
      }
      .caozuoButton {
        position: absolute;
      }
      .box-num-tip {
        width: 1.5em;
        height: 1.5em;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        color: #000000;
        font-weight: 700;
        cursor: pointer;
        position: absolute;
      }
      .box-num-tip:hover {
        box-shadow: 0 0 5px 2px #70bcff;
      }
    }
  }
  .drawer-left {
    width: 1020px;
    height: 100%;
    float: left;
    .content_table {
      height: 100%;
      width: 100%;
      overflow: hidden;
      position: relative;
      .table_head,
      .table_list {
        width: 100%;
        table {
          width: 100%;
          table-layout: fixed;
          border-spacing:0;
          text-align: center;
        }
        td,
        th {
          border: 1px #dedede solid;
          height: 30px;
          font-size: 13px;
          text-align: center;
        }
        thead {
          height: 30px;
          background: #eeeeee;
        }
        td {
          height: 30px;
          font-size: 13px;
          font-weight: 500;
        }
        .body-col {
          &:hover {
            background-color: #e6f7ff
          }
          &.selected {
            background-color: #cccdfb;
            &:hover {
              background-color: #b3b5f1;
            }
          }
        }
        /* 添加这个样式来在拖动时隐藏边框 */
        .body-col.dragging {
          border: none;
          pointer-events: none;
        }

        /* 添加这个样式来在拖动时高亮目标行 */
        .body-col.drag-over {
          border: 1px dashed #999;
        }
      }
      .table_head {
        height: 30px;
        overflow: hidden;
        border-bottom: 1px #e4e4e4 solid;
        th {
          cursor: pointer;
        }
      }
      .table_list {
        height: calc(100% - 50px);
        overflow-y: auto;
        tr {
          cursor: pointer;
        }
      }
    }
  }
  .drawer-right {
    width: 180px;
    height: 100%;
    float: left;
    padding: 0px 5px;
    background-color: white;
    border-left: 1px #efefef solid;
    .transform-card {
      width: 100%;
      height: 38px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #ecf5ff;
      border: 1px #b3d8ff solid;
      cursor: pointer;
      font-weight: 700;
      margin-bottom: 3px;
      color: #409eff;
    }
    .transform-card-active {
      background-color: #409eff;
      border-color: #409eff;
      color: #fff;
    }
  }
  ::v-deep .el-drawer__body{
    flex: none;
    height: calc(100% - 79px);
    overflow: hidden;
  }
  /* 添加半透明效果和虚线边框 */
  .body-col.dragging {
    opacity: 0.6;
    border: 1px dashed #ccc;
  }

  /* 添加过渡效果 */
  .transform-card {
    transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }
  .transform-card.hover {
    background-color: #409eff;
    color: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  }
  ::v-deep .el-drawer__header {
    margin-bottom: 0px;
    padding: 8px;
    color: #000000;
    border-top: 1px solid #ebebeb;
  }
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>