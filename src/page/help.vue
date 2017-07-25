<template>
	<div class="help">
		<header>
	      <pageHead>
	        <i slot="head-left" class="iconfont icon-fanhui" @click="goBack"></i>
	        <span slot="head-center">帮助</span>
	      </pageHead>
	    </header>

		<div style="height:.88rem;width:100%;"></div>

		<div class="help-wrap">
			<dl v-for="(item,index) in info" key="index">

				<dt v-if="item.title != '' " style="color:#999">{{item.title}}</dt>

				<dd class="Temdt" v-if="item.title == '' "></dd>

				<router-link 
					tag="dd" 
					v-for="(items,index) in item.child" 
					:to="{name:'helpDetail',params:{id:items.params,title:items.title}}" 
					v-text="items.title" 
					key="index"
				>
				</router-link>
			</dl>
		</div>
	</div>
</template>
<script>
	import pageHead from '@/components/head'
	export default {
		data() {
			return {
				info:[
					{
						title:'闪电发货',
						child:[
							{
								title:'配送时间及范围',
								params:1
							},
							{
								title:'验收及拒收',
								params:2
							}
						]
						
					},
					{
						title:'售后服务',
						child:[
							{
								title:'服务承诺',
								params:3
							},
							{
								title:'退货条款',
								params:4
							},
							{
								title:'退换货流程',
								params:5
							},
							{
								title:'发票制度',
								params:6
							},
							{
								title:'常见问题',
								params:7
							}
						]
							
					},
					{
						title:'',
						child:[
							{
								title:'服务协议',
								params:8
							}
						]
					},
					{
						title:'',
						child:[
							{
								title:'商务合作',
								params:9
							}
						]
					},
					{
						title:'',
						child:[
							{
								title:'服务条款',
								params:10
							}
						]
					}
				]
			}

		},
		components: {
		    pageHead
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			}
		}
	}
</script>
<style lang="scss" scoped>
header{
	position:fixed;
	top:0;
	height: .88rem;
	background: #fff;
	width:100%;
}
.help-wrap{
	width: 100%;
	dl{
		background:#fff;
		dt{
			padding:0 .3rem;
			height:.88rem;
			line-height:.88rem;
			background:#eee;
		}
		.Temdt{
			height:.22rem;
			background:#eee;
		}
		dd{
			height: .88rem;
		    line-height: .88rem;
		    padding: 0 .3rem;
		    background-color: #fff;
		    border-bottom: 1px solid #eee;
		}
	}

}

</style>