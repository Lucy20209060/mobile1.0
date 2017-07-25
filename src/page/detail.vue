<template>
	<div class="detail-wrap">
		<div class="product-top" v-show="topShow">
			<h3 slot="head-center">商品详情</h3>			
			<div class="detail-fanhui-no">
				<i slot="head-left" class="iconfont icon-fanhui" @click="goback"></i>
			</div>
			<div class="detail-dianpu-no">
				<router-link to="/home">
					<i class="iconfont icon-dianpu"></i>
				</router-link>
			</div>
		</div>
		
		<!-- 商品轮播图 -->
		<div class="product-wrap">
			<div class="product-list">
				<mt-swipe :auto="0">
				  <mt-swipe-item v-for="(item,index) in bannerList" key="index">
				  	<img v-bind:src='imgPre + item.image_url' :onerror="imgErr">
				  </mt-swipe-item>				  
				</mt-swipe>
			</div>			

			<div class="detail-top" v-show="!topShow">
				<div class="detail-fanhui" @click="goback">
					<i class="iconfont icon-fanhui"></i>
				</div>

				<div class="detail-dianpu">
					<router-link to="/home">
						<i class="iconfont icon-dianpu"></i>
					</router-link>
				</div>

			</div>
		</div>
		
		<!-- 商品信息 -->
		<div class="product-detail">
			<div class="product-title">
				<h4>{{detail.goods_name}}</h4>
				<span>商品ID：<i>{{ detail.goods_id}}</i></span>
			</div>

			<p class="product-introduce" v-if="detail.goods_remark != ''">
				{{ detail.goods_remark }} 
			</p>

			<p class="product-price" v-if="price != -1">
				<i class="iconfont icon-weibiaoti-4">
					<span>&nbsp;{{ price }}</span>
				</i>
			</p>
			<p class="product-alert" v-if="price == -1">认证可见</p>

			<p class="product-carriage">
				<i class="iconfont icon-gou"></i>
				包邮
			</p>
		</div>

		<!-- 商品详情图 -->
		<div class="product-headline">
			<span class="headline-left">一</span>
			<span class="headline-content">商品详情</span>
			<span class="headline-right">一</span>
		</div>
		<div class="product-info">
			<ul>
				<li v-for="(item,index) in attrs" v-if="item != null">
					<i>{{ index }}:</i>
					<span>{{ item }}</span>
				</li>
			</ul>
			<section class="proimg-wrap" v-html="detail.goods_content"></section>
		</div>
		
		<!-- 显示选择的规格、数量-->
		<div class="product-standard" v-show="standardShow" @click="toggleStandardList">
			<span class="sweet-standard" >{{standardType}} x{{ goodsNum }}</span>
			<div class="choice-standard" >选择规格数量&nbsp;<i class="iconfont icon-xiala"></i></div>
		</div>
		<!-- 客服、购物车、加入购物车 -->
		<div class="shop-container" v-show="shopShow">
			<div class="shop-wrap">
				<div class="customer-service" @click="service">
					<i class="iconfont icon-kefu"></i>
					<p>客服</p>
				</div>
				<div class="shopping-car">
					<router-link to="/shopCart" cl="">

						<i class="iconfont icon-gouwuche shop"></i>

						<span>
							<mt-badge type="success" size="small" color="#009e4d" v-if="cartNumber > 9">
								{{ cartNumber }}
							</mt-badge>
							<i class="iconfont icon-weibiaoti-5 goodsnumber" v-if="cartNumber < 10 ">
								<span>{{ cartNumber }}</span>
							</i>
						</span>

						<p>购物车</p>
					</router-link>
				</div>
				<div class="add-car" @click="addCartBtn">加入购物车</div>
			</div>
		</div>

		<!-- 规格详情 -->
		<transition name="toggle-standard">
			<mt-popup  
				v-model="standardListShow"  
				popup-transition="popup-fade" 
				position="bottom" 
				style="width: 100%;height: 7.94rem;"
			>
				<div class="standard-list" >
					<div class="standard-title">
						<img :src="imgPre + smallImgUrl" :onerror="imgErr">
						<ul>
							<li>{{ detail.goods_name }}</li>
							<li class="priceSure" v-if="price != -1">
								<i class="iconfont icon-weibiaoti-4"></i>&nbsp;{{ price }}
							</li>
							<li class="priceAlert" v-if="price == -1">认证可见</li>
						</ul>
						
					</div>

					<div class="specs-details" v-if="acquiescent != '默认'">
						<h4>规格</h4>
						<ul>
							<li 
								v-for="(spec,index) in filter_spec" 
								:class="[{specActive:spec.item_id==classSign,saleout:returnInfo(spec.item_id).store_count == 0}]"   
								key="index" 
								v-text="spec.item" 
								v-if="{saleout:saleStatus}" 
								@click="standardChoose(spec.item,returnInfo(spec.item_id))">
							</li>
						</ul>
					</div>
					<div class="standard-num">
						<h4>数量</h4>
						<ul>
							<li @click="toggleDown">-</li>
							<li >
								<input 
								type="Number" 
								id="numshow" 
								v-model="goodsNum" 
								style="padding: 0;font-size: .25rem;" 
								placeholder="1" />
							</li>
							<li @click="toggleUp">+</li>
						</ul>
					</div>

					<div 
						class="standard-submit" 
						v-if="submitActive == 1 && isonsale == 1" 
						@click="standardSubmit">
						选择商品规格、数量
					</div>

					<div 
						class="standard-submit" 
						v-if="submitActive == 0 && isonsale == 1" 
						@click="standardSubmit">
						确认
					</div>
					<div class="shixiao" v-if="isonsale == 0">商品已失效</div>
				</div>
			</mt-popup>
		</transition>
				
	</div>
</template>

<script>
	import pageHead from '@/components/head'
	import { overFlow } from '@/assets/public/function'
	export default {
		data() {
			return {
				imgPre:this.$api.imgPre, 		//图片前缀
      			bannerList:[], 					//banner图列表
      			smallImgUrl: [], 				//规格列表中的缩略图
				showStandardList: false, 		//显示商品规格列表
				topShow: false, 				//显示商品详情title
				standardShow: true, 			//显示商品规格
				shopShow: true, 				//显示加入购物车状态
				standardListShow: false, 		//显示规格列表
				standardActiveSure: true, 		//点击选中规格列表
				detail: [], 					//商品详情

				ID: this.$route.params.id, 		//商品ID
				price: 0, 						//商品价格
				specKey: '',					// 选择的商品规格

				string_goods_price: '', 		// 商品价格字符串
				classSign: 0,
				goodsNum: 1, 					//选择的商品数量
				submitActive: 0,			 	//规格列表中确认按钮状态
				standardType: '',				//规格类别
				acquiescent:'',					// 是否是默认规格
				cartNumber: 0 ,
				isonsale: 0,					//商品失效
				saleStatus: false,
				countNum: 1,

				attrs:[],						// 商品详情描述
				filter_spec:[],					// 规格
				is_verify: '',       			//认证状态
				scrolldistance: "",				//滚动距离
				isshixiao: 1,					//商品失效
				scrollArr:[],					//滚动条高度
				imgErr:'this.src="/static/images/imgtem.png"'
			}
		},
		created() {
			const _this = this;

		  	this.mobile = this.$store.state.userInfo.mobile;
		  	this.is_verify = this.$store.state.userInfo.is_verify;

		  	let timeoutTem = setTimeout(function(){

		  		_this.mobile = _this.$store.state.userInfo.mobile;
		  		_this.is_verify = _this.$store.state.userInfo.is_verify;

		  		clearTimeout(timeoutTem);
		  	},500);

			this.details();
			this.getCartNum();
		},
		watch: {
			//实时监控库存量 最大购买数量<=库存
			countNum:{
				handler(curval,oldval){
					if (curval < this.goodsNum) {
						this.goodsNum = curval;
					}
				},
				deep: true
			},
			goodsNum:{
				handler(curval,odlval) {
					if(curval <= 0) {
						this.goodsNum = 1;
					}
					if(curval == '' || oldval == '') {
						this.goodsNum = 1;
					}
				},
				deep:true
			},
			standardType:{
				handler(curval,odlval) {
					let Info = {
						id:this.ID,
						standardType:this.standardType,
						specKey:this.specKey,
						goodsNum:this.goodsNum,
						classSign:this.classSign,
						countNum:this.countNum,
						price:this.price
					}

					
					this.$store.commit('setSpecInfo',Info);
				},
				deep:true
			},
			// 保存商品信息 返回该页面时使用
			goodsNum:{
				handler(curval,odlval) {
					let Info = {
						id:this.ID,
						standardType:this.standardType,
						specKey:this.specKey,
						goodsNum:this.goodsNum,
						classSign:this.classSign,
						countNum:this.countNum,
						price:this.price
					}

					
					this.$store.commit('setSpecInfo',Info);
				},
				deep:true
			},
			scrolldistance: {
				handler(curval, oldval) {
					if(curval > 100) {
						if(curval > oldval) {
							this.topShow = true;
							this.standardShow = false;
							this.shopShow = false;
						}else{
							this.topShow = false;
							this.standardShow = true;
							this.shopShow = true;
						}						
					}else {
						this.topShow = false;
						this.standardShow = true;
						this.shopShow = true;
					}
				},
				deep: true
			},
			standardListShow:{
				handler(curval, oldval) {
					if(curval){
						overFlow();
					}else{
						overFlow('auto');
					}
				}
			}
			
		},
		mounted: function() {
			this.$nextTick(function(){
				window.addEventListener('scroll', this.onScroll)
			})
		},
		methods: {
			// 客服
			service(){
		      ysf.open();
		    },

			//显示规格列表
			toggleStandardList() {
				if (this.standardListShow != true) {
					this.standardListShow = true;
					this.showStandardList = true;
				} else {
					this.standardListShow = false;
					this.showStandardList = false;
				}
			},
			//购物车和规格出现\消失
			onScroll() {
				this.scrolldistance = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
				this.scrollArr.push(this.scrolldistance);
      			this.scrollArr = this.scrollArr.slice(-2);
      			this.$store.commit('setScrollTop',this.scrollArr);
			},

			//选择规格
			standardChoose(item,spec) {
				if(spec.store_count == 0){
					return false;
				}
				this.submitActive = 0;
				this.classSign = spec.key;
				//选择的商品规格
				this.specKey = spec.key;
				this.standardType = item;
				//商品价格
				this.price = spec.price;
				//商品剩余数量
				this.countNum = spec.store_count;
			},
			//规格提交
			standardSubmit() {
				this.standardListShow = false;
				this.showStandardList = false;
			},
			//增加
			toggleUp() {
				this.submitActive = 0;
				if(this.goodsNum < this.countNum) {	
					this.goodsNum++;
				}else{
					this.goodsNum = this.countNum;
				}
			},
			//减少
			toggleDown() {
				this.submitActive = 0;
				if(this.goodsNum > 1) {
					this.goodsNum--;
				}else{
					this.goodsNum = 1;
				}
			},
			// 加入购物车按钮
			addCartBtn(){
				if(this.is_verify == '') {
					this.$toast("请先登录");
					this.$router.push({path:'/login'});
					return false;
				}else if(this.is_verify == -1) {
					this.$toast("认证待审核 请稍后");
					return false;
				}else if(this.is_verify == -2) {
					this.$toast("账号认证失败 前去PC端重新认证 b2b.hzanchu.com");
					this.$router.push({path:'/register/2'});
					return false;
				}else if(this.is_verify == -3) {
					this.$toast("账号尚未认证 前去PC端认证 b2b.hzanchu.com");
					this.$router.push({path:'/register/2'});
					return false;
				}else if(this.is_verify == -4 || this.is_verify == 3) {
					this.$toast("账号认证尚未成功 前去PC端重新认证 b2b.hzanchu.com");
					this.$router.push({path:'/register/2'});
					return false;
				}else if(this.is_verify == 1){
					this.addCart();
				}else if(this.is_verify == 2){
					this.$toast("认证待审核 请稍后");
					return false;
				}
			},

			//加入购物车
			addCart() {
				const _this = this;
				this.$axios({
					url:this.$api.detail.cartAdd,
					params: {
						goods_id:_this.$route.params.id,
						goods_num:_this.goodsNum,
						goods_spec:_this.specKey
					},
				}).then(function(res){
					if(res.data.status == 1){
						_this.getCartNum();
							_this.$toast({
				            message: res.data.msg,
				            position: 'center',
				            duration: 1000
				          });
						_this.countNum -= _this.goodsNum;
					}else{
						_this.$toast(res.data.msg)
					}
				}).catch(function(error){

				})
			},

			//获取购物车的数量
			getCartNum() {
				var _this = this;
				this.$axios({
					url: this.$api.detail.cartNum
				}).then(function(res){
					if(res.data.data) {
						_this.cartNumber = res.data.data;
					}else{
						_this.cartNumber = 0;
					}
				}).catch(function(error){

				})
			},

			//获取商品详情
			details() {
				var _this = this;
				this.$axios({
					methods:"get",
					url:this.$api.detail.detail,
					params: {
						id: this.ID
					}
				}).then(function(res){
					const data = res.data.data;
					// 商品详情
					_this.detail = data.goods;

					// 商品描述
					_this.attrs = data.attrs;

					//默认的banner图
					_this.bannerList = data.goods_images_list;

					// 规格
					_this.filter_spec = data.filter_spec[0].items;

					// 是否是默认规格
					_this.acquiescent = data.filter_spec[0].label;

					// 小图
					_this.smallImgUrl = data.goods_images_list[0].image_url;

					//规格不同对应的价格 库存
					_this.string_goods_price = JSON.parse(data.spec_goods_price);

					// 是否下架
					_this.isonsale = data.goods.is_on_sale;

					if(_this.$store.state.specInfo.id == _this.$route.params.id){
						// 默认规格id 和 默认规格
						_this.standardType = _this.$store.state.specInfo.standardType;
						_this.specKey = _this.$store.state.specInfo.specKey;
						// 默认选中
						_this.classSign = _this.$store.state.specInfo.classSign;
						// 默认价格
						_this.price = _this.$store.state.specInfo.price;
						//默认规格剩余数量
						_this.countNum = _this.$store.state.specInfo.countNum;

						_this.goodsNum = _this.$store.state.specInfo.goodsNum;

						return false;

					}

					if(data.filter_spec != 0) {

						const items = data.filter_spec[0].items;

						if(data.filter_spec[0].label == "默认"){

							// 默认规格id 和 默认规格
							// _this.standardType = items[i].item;
							_this.specKey = items[0].item_id;
							

							let returnSpcInfo = _this.returnInfo(items[0].item_id);

							// 默认价格
							_this.price = returnSpcInfo.price;

							//默认规格剩余数量
							_this.countNum = returnSpcInfo.store_count;
							// console.log(_this.countNum)
							//失效按钮显示
							if(_this.countNum <= 0 ){
								_this.isonsale = 0;
							}else{
								_this.isonsale = 1;
							}
							
							return false;

						}

						for(let i in items){

							// 寻找第一个 库存量不为零 的规格 并将其设为初始值
							let returnSpcInfo = _this.returnInfo(items[i].item_id);


							if(returnSpcInfo.store_count != 0){

								// 默认规格id 和 默认规格
								_this.standardType = items[i].item;
								_this.specKey = returnSpcInfo.key;
								// 默认选中
								_this.classSign = returnSpcInfo.key;
								// 默认价格
								_this.price = returnSpcInfo.price;
								//默认规格剩余数量
								_this.countNum = returnSpcInfo.store_count;
								//失效按钮显示
								_this.isonsale = 1;
								return false;
							}else{
								_this.isonsale = 0;
							}

							}

					}else{

						_this.countNum = Number(data.goods.store_count);
						_this.price = detail.price;
					}
					
				}).catch(function(error){

				})
			},

			// 通过规格获取对应的信息
			returnInfo(id){
				return this.string_goods_price[id];
			},

			// 返回上一页
			goback() {
				this.$router.go(-1);

			}
		}
	}
</script>

<style lang="scss">
	.detail-wrap {
		background-color: #eee;
	}
	.product-top {
		position: fixed;
		top: 0rem;
		z-index: 10;
		width: 100%;
		height: 1rem;
		background-color: #fff;
		h3 {
			color: #333;
			font-weight: 200;
			height: 1rem;
			line-height: 1rem;
			text-align: center;
			position: relative;
			&:before{
			content: '';
			position: absolute;
			left: 0;
			bottom: -1px;
			width: 200%;
			height: 1px;
			border-top: 1px solid #eee;
			background: #eee;
			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;
			-webkit-transform: scale(.5,.5);
			transform: scale(.5,.5);
			-webkit-box-sizing: border-box;
			box-sizing: border-box;
			z-index: 99999999999;
			}
		}
	}
	.detail-top {
		height: 1rem;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		background-color: rgba(0,0,0,0);
	}
	.detail-fanhui {
		position: absolute;
		left: .3rem;
		top: .2rem;
		width: .6rem;
		height: .6rem;
		line-height: .6rem;
		border-radius: 50%;
		background: rgba(0,0,0,0.3);
		i {
			position: absolute;
			left: .08rem;
			top: .03rem;
			font-size: .38rem;
			color: #fff;			
		}
	}
	.detail-dianpu {
		position: absolute;
		right: .3rem;
		top: .2rem;
		width: .6rem;
		height: .6rem;
		text-align: center;
		line-height: .6rem;
		border-radius: 50%;
		background: rgba(0,0,0, 0.3);
		i {
			position: absolute;
			left: .12rem;
			top: .03rem;
			font-size: .38rem;
			color: #fff;			
		}
	}
	.detail-fanhui-no {
		position: absolute;
		left: .3rem;
		top: .2rem;
		width: .6rem;
		height: .6rem;
		text-align: center;
		line-height: .6rem;
		i {
			font-size: .38rem;
			color: #333;
		}
	}
	.detail-dianpu-no {
		position: absolute;
		right: .3rem;
		top: .2rem;
		width: .6rem;
		height: .6rem;
		text-align: center;
		line-height: .6rem;
		i {
			font-size: .38rem;
			color: #333;
		}
	}
	.product-wrap {
		position: relative;
		background-color: #fff;
	}
	.product-list {
		width: 100%;
		height: 7.5rem;
		img {
			width: 100%;
			height: auto;
		}
	}
	
	.product-detail {
		padding: .3rem .3rem .2rem .3rem;
		background-color: #fff;
	}
	.product-title {
		overflow: hidden;
		font-size: .3rem;
		color: #333;
		h4 {
			float: left;
			font-size: .3rem;
			font-weight: 900;
			color: #333;
			overflow : hidden;
			width: calc(100% - 2rem);			
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
		span {
			float: right;
			font-size: .26rem;
			color: #999;
			text-align: right;
			width: 2rem;
			margin-top: .05rem;
		}
	}
	.product-introduce {
		margin-top: .24rem;
		padding: .2rem;
		color: #666;
		font-size: .26rem;
		background-color: #fff9f0;
	}
	.product-price {
		font-size: .34rem;
		margin-top: .15rem;
		display: inline-block;
		width: 100%;
		height: .4rem;
		line-height: .4rem;
		color: red;
		i {
			font-size: .28rem;
			display: inline-block;
			height: .4rem;
			line-height: .3rem;
			span {
				font-size: .35rem;
			}
		}
	}
	.product-alert {
		font-size: .3rem;
		margin-top: .26rem;
		color: #009e4d;
	}
	.product-carriage {
		font-size: .2rem;
		margin-top: .07rem;
		color: #999999;
		i {
			margin-right: .1rem;
			font-size: .2rem;
			display: inline-block;
			width: .22rem;
			height: .22rem;
			color: #009e4d;
			background: #eee;
			border-radius: 50%;
			text-align: center;			
		}
	}
	.product-headline {
		height: 1rem;
		line-height: 1rem;
		font-size: .3rem;
		display: flex;
		margin-top: .1rem;
		background-color: #fff;
	}
	.headline-left {
		flex: 2;
		font-size: .28rem;
		font-weight: 800;
		text-align: right;
		height: 1rem;
		line-height: 1rem;
		color: #999;
	}
	.headline-content {
		text-align: center;
		width: 20%;
		flex: 1;
		height: 1rem;
		line-height: 1rem;
	}
	.headline-right {
		flex: 2;
		font-size: .28rem;
		font-weight: 800;
		height: 1rem;
		line-height: 1rem;
		color: #999;
	}
	.content {
		height: 5rem;
	}
	.product-info {
		background-color: #fff;
		li {
			padding: 0 .3rem;
			min-height: .8rem;
			display: flex;
			font-size: .26rem;
			color: #999;
			border-top: 1px solid #eee;
			overflow: hidden;
			span {
				color: #333;
				width: 75%;
				padding-top: .24rem;
			}
			i {
				padding-right: .5rem;
				width: 25%;
				height: .8rem;
				line-height: .8rem;
				-moz-box-sizing: border-box;
			  	-webkit-box-sizing: border-box;
			  	-o-box-sizing: border-box;
			  	-ms-box-sizing: border-box;
			  	box-sizing: border-box;
			}
		}
	}
	.product-standard {
		position: fixed;
		bottom: .98rem;
		width: 100%;
		line-height: .88rem;
		height: .88rem;
		background-color: #fff;
		border-top: 1px solid #eee;
		box-shadow: 0rem 0rem .1rem .1rem rgba(200,200,200,0.1);
		z-index: 90;
	}
	.sweet-standard {
		float: left;
		font-size: .3rem;
		color: #009e4d;
		margin-left: .3rem;
	}
	.choice-standard {
		float: right;
		font-size: .3rem;
		margin-right: .3rem;
	}
	.shop-container {
		position: fixed;
		bottom: 0;
		height: .98rem;
		width: 100%;
		z-index: 90;
	}
	.shop-wrap {
		display: flex;
		height: .98rem;
		background-color: #fff;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		-o-box-sizing: border-box;
		-ms-box-sizing: border-box;
		box-sizing: border-box;
		border-top: 1px solid #ddd;		
	}
	.customer-service {
		flex: 1;
		text-align: center;
		font-size: .24rem;
		color: #666;
		border-right: 1px solid #ddd;
		padding-top: .1rem;
		i {
			color: #666;
			font-size: .4rem;
		}
	}
	.shopping-car {
		flex: 1;
		text-align: center;
		font-size: .24rem;
		color: #666;
		padding-top: .1rem;
		position: relative;
		span {
			position: absolute;
			left: 50%;
			top: 5%;
		}
		.shop {
			color: #666;
			font-size: .4rem;
		}
		p {
			color: #666;
		}
	}
	.add-car {
		flex: 3;
		text-align: center;
		background-color: #009e4d;
		color: #fff;
		line-height: .98rem;
		font-size: .34rem;
	}
	.screen-cover {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0,0,0,0.3);
		z-index: 11;
	}
	.standard-list {
		position: fixed;
		bottom: 0;
		z-index: 91;
		width: 100%;
		height: 7.94rem;
		background-color: #fff;
	}
	.standard-title {
		height: 1.56rem;
		padding: .18rem .3rem .22rem .3rem;
		border-bottom: 1px solid #ddd;
		color: #333;
		img {
			display: inline-block;
			width: 1.2rem;
			height: 1.2rem;
		}
		ul {
			display: inline-block;
			vertical-align: top;
			margin-left: .24rem;
			width: calc(100% - 2rem);
			li {
				height: .5rem;
				line-height: .5rem;
				white-space: nowrap;
				overflow: hidden;
				text-overflow:ellipsis;				
			}
			li:nth-of-type(2) {
				margin-top: .2rem;
			}
		}
	}
	.priceAlert {
		color: #009e4d;
	}
	.priceSure {
		color: #eb3d24;			
		i {
		font-size: .27rem;
		}
	}
	.specs-details {
		h4 {
			font-size: .26rem;
			margin: .26rem .3rem 0 .28rem;
		}
		ul {
			display: flex;
			flex-wrap: wrap;
			padding: 0 .3rem .22rem .3rem;
			border-bottom: 1px solid #ddd;
			li {
				padding: 0 .3rem;
				height: .6rem;
				line-height: .65rem;
				text-align: center;
				font-size: .26rem;
				border: 1px solid #ddd;
				margin-right: .24rem;
				margin-top: .18rem;
			}
			.specActive {
				border-color: #009e4d;
				color: #009e4d;
			}
			.saleout {
				color: #eee;
				border-color: #ddd;
			}
		}
	}	
	.standard-num {
		h4 {
			font-size: .26rem;
			margin: .23rem .3rem 0 .28rem;
		}
		ul {
			height: .6rem;
			line-height: .6rem;
			margin-left: .3rem;
			margin-top: .2rem;
			display: inline-block;
			li {
				float: left;
				width: .6rem;
				text-align: center;
				border: 1px solid #ddd;
				border-right: none;
				height: 100%;
				overflow: hidden;
				-moz-box-sizing: border-box;
			  	-webkit-box-sizing: border-box;
			  	-o-box-sizing: border-box;
			  	-ms-box-sizing: border-box;
			  	box-sizing: border-box;
			}	
			li:nth-of-type(3) {
				border-right: 1px solid #ddd;
			}
			input {
				width: 100%;
				border: none;
				text-align: center;
				display: inline-block;
				height: 100%;				
			}
		}
	}
	.standard-submit {
		position: fixed;
		bottom: 0;
		background-color: #009e4d;
		height: .98rem;
		width: 100%;
		line-height: .98rem;
		text-align: center;
		font-size: .3rem;
		color: #fff;
	}
	.shixiao {
		position: fixed;
		bottom: 0;
		background-color: #999;
		height: .98rem;
		width: 100%;
		line-height: .98rem;
		text-align: center;
		font-size: .3rem;
		color: #fff;
	}
	.proimg-wrap{
		width: 100%;
		
	}
	.proimg-wrap p{
			line-height: 0;
			img{
				width: 100%;
				height: auto;
			}
		}
	.goodsnumber {
		color: #009e4d;
		font-size: .32rem;
		position: relative;
		/*top: -1px;*/
		left: 1px;
		span {
			position: absolute;
			top: 1%;
			left: 30%;
			font-size: .24rem;
			color: #fff;
		}
	}
</style>