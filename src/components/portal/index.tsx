/**
 * Created by wanghongxiang on 2017/6/27.
 */
export default {
    name: 'sn-layout',
    props: {
        href: String
    },
    render () {
        return <div class="snLayout">测试</div>
    },
    install (Vue: any) {
        Vue.component('sn-layout', this)
    }
}
