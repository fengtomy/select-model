/**
 * Created by xiaohu on 2017/10/25.
 */
var filterBus = new Vue();
var btnBus = new Vue();
var filterInput = {
    template: "<div><input type='text' class='input input-large' v-model='str' @input='filterList' /></div>",
    data: function(){
        return {
            str: ""
        };
    },
    methods: {
        filterList: function(){
            this.$parent.str = this.str;
        }
    }
};
var buttonList = {
    template: "<div>" +
        "<div v-for='btn in btnList' :key='btn.id' :style='btnBox'><button class='btn btn-default btn-lg' @click='exchangeSlt(btn.id)'>{{btn.text}}</button></div>" +
        "</div>",
    data: function(){
        return {
            btnList: [
                {text: ">>", id: "go"},
                {text: "<<", id: "back"},
                {text: "全部添加", id: "allGo"},
                {text: "全部取消", id: "allBack"}
            ],
            btnBox: {
                textAlign: "center",
                marginTop: "10px"
            }
        };
    },
    methods: {
        exchangeSlt: function(id){
            btnBus.$emit("btn", {
                id: id
            });
        }
    }
};
var selectModel = {
    template: "<select class='select form-control' @change='showSelect' multiple v-model='selected'>" +
        "<option v-for='(opt,index) in optionList.map' :value='index' :val='opt.val'>{{opt.text}}</option>" +
    "</select>",
    props: ["optionList"],
    data: function(){
        return {
            selected: []
        };
    },
    methods: {
        showSelect: function(){
            var sltType = this.optionList.id;
            if(sltType == "from"){
                this.$parent.selectedFrom = this.selected;
            }else if(sltType == "to"){
                this.$parent.selectedTo = this.selected;
            }
        }
    }
};

var selectBox = new Vue({
    el: ".select-box",
    data: {
        list1: {
            id: "from",
            map: [
                {val: "0001", text: "ceshi1"},
                {val: "0002", text: "ceshi2"},
                {val: "0003", text: "ceshi3"},
                {val: "0004", text: "ceshi4"},
                {val: "0005", text: "ceshi5"},
                {val: "0006", text: "ceshi6"},
                {val: "0007", text: "ceshi7"},
                {val: "0008", text: "ceshi8"},
                {val: "0009", text: "ceshi9"}
            ]
        },
        list2: {
            id: "to",
            map: [
                    {val: "0011", text: "测试1"},
                    {val: "0012", text: "测试2"},
                    {val: "0013", text: "测试3"},
                    {val: "0014", text: "测试4"},
                    {val: "0015", text: "测试5"},
                    {val: "0016", text: "测试6"},
                    {val: "0017", text: "测试7"},
                    {val: "0018", text: "测试8"},
                    {val: "0019", text: "测试9"}
                ]
        },
        str: "",
        selectedFrom: [],
        selectedTo: []
    },
    computed: {
        filterList1: function(){
            var obj = {};
            var ary = [];
            var list = this.list1.map,
                  len = list.length;
            var id = this.list1.id;
            if(this.str == ""){
                ary = this.list1;
                return obj = {
                    id: id,
                    map: this.list1.map
                };
            }
            for(var i = 0; i < len; i++){
                var thisOne = list[i],
                      text = thisOne.text;
                if(text.indexOf(this.str) != -1){
                    ary.push(thisOne);
                }
            }
            return obj = {
                id: id,
                map: ary
            };
        }
    },
    components: {
        filterInput: filterInput,
        buttonList: buttonList,
        selectModel: selectModel
    },
    created: function(){
        var that = this;
        //处理列表左右选择
        btnBus.$on("btn", function(val){
            var fromLen, toLen;
            var type = val.id;
            if(type == "go"){
                fromLen = that.selectedFrom.length;
                for(var i = 0; i < fromLen; i++){
                    var idx = that.selectedFrom[i] - i;
                    var lostOne = that.list1.map.splice(idx, 1);
                    that.list2.map.push(lostOne[0]);
                    that.$refs.from.selected = [];
                }
                that.selectedFrom = [];
            }else if(type == "back"){
                toLen = that.selectedTo.length;
                for(var i = 0; i < toLen; i++){
                    var idx = that.selectedTo[i] - i;
                    var lostOne = that.list2.map.splice(idx, 1);
                    that.list1.map.push(lostOne[0]);
                    that.$refs.to.selected = [];
                }
                that.selectedTo = [];
            }else if(type == "allGo"){
                that.list2.map = that.list2.map.concat(that.list1.map);
                that.list1.map = [];
                that.$refs.from.selected = [];
                that.selectedFrom = [];
            }else if(type == "allBack"){
                that.list1.map = that.list1.map.concat(that.list2.map);
                that.list2.map = [];
                that.$refs.to.selected = [];
                that.selectedTo = [];
            }
        });
    }
});