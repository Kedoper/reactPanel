import React from "react";
import {Alert, Button, Card, Form, Icon, Input} from "antd";
import {Link, Redirect, Route} from "react-router-dom";
import {connect} from "react-redux";
import {setLoggedStatus} from "../redux/actions";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

function sendRequest(method = "GET", url, data = {}) {
    return new Promise((resolve, reject) => {
        let xr = new XMLHttpRequest(),
            body = JSON.stringify(data);
        xr.withCredentials = true;
        xr.open(method, url);
        xr.send(body);
        xr.onreadystatechange = function () {
            if (xr.readyState === 4 && xr.status === 200) {
                try {
                    resolve(JSON.parse(xr.response));
                } catch (e) {
                    reject()
                }
            }
        }
    });
}

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userNameStatus: '',
            userPasswordStatus: '',
            validating: false,
            validatingMessage: ''
        };
    }

    formSubmitHandler = e => {
        e.preventDefault();
        let userName = document.getElementById('loginForm_username').value,
            userPassword = document.getElementById('loginForm_password').value;

        this.setState({
            userPasswordStatus: 'validating',
            userNameStatus: 'validating',
            validating: true,
        });

        let response = sendRequest('POST', 'http://127.0.0.1:8011/login',
            {login: userName, pass: userPassword});
        response.then(value => {
            let validate = false;
            if (value.password === "success" && value.username === "success") {
                validate = true
            }
            setTimeout(() => {
                this.setState({
                    userPasswordStatus: value.password,
                    userNameStatus: value.username,
                    validating: validate,
                    validatingMessage: value.error_message
                });
                if (validate) {
                    localStorage.setItem('_priceT', JSON.stringify({user_id: value.user_data.id}));

                    window.location = '/t';
                }
            }, 1500)
        }).catch(() => {
            setTimeout(() =>
                this.setState({
                    userPasswordStatus: 'error',
                    userNameStatus: 'error',
                    validating: false,
                    validatingMessage: 'В данный момент сервер недоступен, повторите попытку позже'
                }), 1500)
        });
    };

    componentDidMount() {
        this.props.form.validateFields();
    }

    render() {
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        const usernameError = isFieldTouched('username') && getFieldError('username');
        const passwordError = isFieldTouched('password') && getFieldError('password');

        return (
            <div className={"centerPage"}>
                <Card title={"Авторизация"} bordered={true} className={"centerPage__form-wrapper"}>
                    {this.state.userNameStatus === 'error' || this.state.userPasswordStatus === 'error' ?
                        <Alert type={"error"} message={'Ошбика при проверке данных'}
                               description={this.state.validatingMessage}
                               style={{marginBottom: 40}}/>
                        : null}
                    <Form onSubmit={this.formSubmitHandler}>
                        <Form.Item validateStatus={usernameError ? 'error' : this.state.userNameStatus}
                                   hasFeedback={true}>
                            {getFieldDecorator('username', {
                                rules: [
                                    {required: true, message: "Это поле необходимо заполнить"},
                                    {min: 4, message: "Логин не может быть короче 4 символов"},
                                    {whitespace: true, message: "Это поле необходимо заполнить"}
                                ]
                            })(
                                <Input prefix={<Icon type={'user'}/>}
                                       placeholder={"Ваш логин"}
                                       disabled={this.state.validating}
                                />
                            )}
                        </Form.Item>
                        <Form.Item hasFeedback={true}
                                   validateStatus={passwordError ? 'error' : this.state.userPasswordStatus}>
                            {getFieldDecorator('password', {
                                rules: [
                                    {required: true, message: "Это поле необходимо заполнить"},
                                    {whitespace: true, message: "Это поле необходимо заполнить"}
                                ]
                            })(
                                <Input prefix={<Icon type={'lock'}/>}
                                       type={'password'}
                                       placeholder={"Ваш пароль"}
                                       disabled={this.state.validating}
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type={"primary"} disabled={hasErrors(getFieldsError()) || this.state.validating}
                                    style={{width: 150, marginRight: 50}} htmlType={'submit'}>
                                Войти
                            </Button>
                            <Button type={"default"} style={{marginRight: 50}} htmlType={'button'}
                                    onClick={() => window.location = "/register"}>
                                Зарегистрироваться
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        );
    }
}

const LoginForm = Form.create({name: "loginForm"})(Login);
export default LoginForm;
