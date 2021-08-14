data() {
        // 密码校验
        var validatePass = (rule, value, callback) => {
        // let reg= /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,20}$/
        let reg = /^[a-zA-Z]\w{5,10}$/
        if (!reg.test(value)) {
            callback(new Error('密码需以字母开头'));
        } else {
            if (this.changePwdForm.checkPassword !== '') {
                this.$refs.changePwdForm.validateField('checkPassword');
            }
            callback();
        }
        };
        // 密码确认校验
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.changePwdForm.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            listLoading: false,
            customerType: [
                {'key': '客户',
                'value': 1},
                {'key': '企业',
                'value': 2}
            ],
            addCustomerVisible: false,
        },
    },