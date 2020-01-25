import React from "react";
import {Alert, Button, Card, Form, Icon, Input} from "antd";
import {Link, Redirect, Route} from "react-router-dom";

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

function sendRequest(method = "GET", url, data = {}) {
    return new Promise((resolve, reject) => {
        let xr = new XMLHttpRequest(),
            body = JSON.stringify(data);
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

class Register extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userNameStatus: '',
            userPasswordStatus: '',
            emailNameStatus: '',
            validating: false,
            validatingMessage: ''
        };
    }

    formSubmitHandler = e => {
        e.preventDefault();
        let userName = document.getElementById('loginForm_username').value,
            userEmail = document.getElementById('loginForm_email').value,
            userPassword = document.getElementById('loginForm_password').value;

        this.setState({
            userPasswordStatus: 'validating',
            userNameStatus: 'validating',
            emailNameStatus: 'validating',
            validating: true,
        });

        let response = sendRequest('POST', 'http://127.0.0.1:8011/register',
            {login: userName, mail: userEmail, pass: userPassword});
        response.then(value => {
            let validate = false;
            if (value.password === "success" && value.username === "success" && value.email === "success") validate = true;
            setTimeout(() =>
                this.setState({
                    userPasswordStatus: value.password,
                    userNameStatus: value.username,
                    emailNameStatus: value.email,
                    validating: validate,
                    validatingMessage: value.error_message
                }), 1500)
        }).catch(() => {
            setTimeout(() =>
                this.setState({
                    userPasswordStatus: 'error',
                    userNameStatus: 'error',
                    emailNameStatus: 'error',
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
        const mailError = isFieldTouched('email') && getFieldError('email');

        return (
            <div className={"centerPage"}>
                <Card title={"Регирстрация"} bordered={true} className={"centerPage__form-wrapper"}>
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
                                       placeholder={"Придумайте логин"}
                                       disabled={this.state.validating}
                                />
                            )}
                        </Form.Item>
                        <Form.Item hasFeedback={true}
                                   validateStatus={passwordError ? 'error' : this.state.userPasswordStatus}>
                            {getFieldDecorator('password', {
                                rules: [
                                    {required: true, message: "Это поле необходимо заполнить"},
                                    {whitespace: true, message: "Это поле необходимо заполнить"},
                                    {min: 8, message: 'Минимальная длинна пароля - 8 символов'}
                                ]
                            })(
                                <Input prefix={<Icon type={'lock'}/>}
                                       type={'password'}
                                       placeholder={"Придумайте пароль"}
                                       disabled={this.state.validating}
                                />
                            )}
                        </Form.Item>
                        <Form.Item hasFeedback={true}
                                   validateStatus={mailError ? 'error' : this.state.emailNameStatus}>
                            {getFieldDecorator('email', {
                                rules: [
                                    {required: true, message: "Это поле необходимо заполнить"},
                                    {whitespace: true, message: "Это поле необходимо заполнить"}
                                ]
                            })(
                                <Input prefix={<Icon type={'mail'}/>}
                                       type={'email'}
                                       placeholder={"Введите адрес вашей почты"}
                                       disabled={this.state.validating}
                                />
                            )}
                        </Form.Item>

                        <Form.Item>
                            <Button type={"primary"} disabled={hasErrors(getFieldsError()) || this.state.validating}
                                    style={{marginRight: 50}} htmlType={'submit'}>
                                Зарегистрироваться
                            </Button>
                            <Button type={"default"} style={{marginRight: 50}} htmlType={'button'}
                                    onClick={() => window.location = "/login"}>
                                Уже есть аккаунт
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        );
    }
}

const RegisterForm = Form.create({name: "loginForm"})(Register);



export default RegisterForm;
