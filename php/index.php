<?php
include_once __DIR__ . '/vendor/autoload.php';
include_once __DIR__ . '/dbConnect.php';

function cors()
{

    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            // may also be using PUT, PATCH, HEAD etc
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }
}

function getIP()
{
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}

function genToken()
{
    return bin2hex(random_bytes(20));
}

function _setCookie($data, $name = '_priceT', $lifetime = 3)
{
    $CookieLifetime = 86400 * $lifetime;
    setcookie($name, $data, time() + $CookieLifetime, '/', $_SERVER['SERVER_NAME'], null, true);
}

cors();

$r = new \Klein\Klein();

$r->post('/login', function () {
    $data = json_decode(file_get_contents('php://input'), true);

    $user = R::findOne('users', 'login = ?', [$data['login']]);

    if (!empty($user)) {
        if (password_verify($data['pass'], $user['password'])) {
            $userID = $user['id'];
            $accessToken = genToken();

            $newToken = R::dispense('tokens');
            $newToken->user_id = $userID;
            $newToken->token = $accessToken;
            $newToken->permissions = 0;
            $newToken->use_ip = getIP();
            R::store($newToken);

            _setCookie($accessToken);

            return json_encode([
                'code' => 0,
                'username' => 'success',
                'password' => 'success',
                'error_message' => null,
                'user_data' => [
                    'id' => $userID
                ]
            ]);
        } else {
            return json_encode([
                'code' => -1,
                'username' => 'error',
                'password' => 'error',
                'error_message' => 'Логин пользователя или пароль введены неверно',
            ]);
        }
    } else {
        return json_encode([
            'code' => -1,
            'username' => 'warning',
            'password' => 'error',
            'error_message' => 'Такого пользователя в системе нет',
        ]);
    }
});

$r->post('/register', function () {
    $data = json_decode(file_get_contents('php://input'), true);

    $user = R::findOne('users', 'login = ? OR email = ?', [$data['login'], $data['mail']]);

    if (empty($user)) {
        $passLength = strlen(str_replace(' ', '', $data['pass']));
        if (str_replace(' ', '', $data['pass']) === '' || empty($data['pass']) || $passLength < 7) {
            return json_encode([
                'code' => -1,
                'username' => 'success',
                'password' => 'error',
                'email' => 'success',
                'error_message' => 'Вы ввели пустой пароль или он меньше необходимой длинны. Символов в вашем пароле - '
                    . $passLength,
            ]);
        }
        $accessToken = genToken();

        $newUser = R::dispense('users');
        $newUser->login = $data['login'];
        $newUser->password = password_hash(str_replace(' ', '', $data['pass']), PASSWORD_DEFAULT);
        $newUser->email = $data['mail'];
        $newUser->first_name = "";
        $newUser->last_name = "";
        $newUser->last_login = time();
        $newUser->permissions = 0;
        $userID = R::store($newUser);


        $newToken = R::dispense('tokens');
        $newToken->user_id = $userID;
        $newToken->token = $accessToken;
        $newToken->permissions = 0;
        $newToken->use_ip = getIP();
        R::store($newToken);

        _setCookie($accessToken);

        return json_encode([
            'code' => 0,
            'username' => 'success',
            'password' => 'success',
            'email' => 'success',
            'error_message' => '',
        ]);
    } else {
        return json_encode([
            'code' => -1,
            'username' => 'error',
            'password' => '',
            'email' => 'error',
            'error_message' => 'Логин пользователя или email уже используются',
        ]);
    }
});


$r->get('/', function () {
//    $user = R::dispense('users');
//    $user->login = "kedoper";
//    $user->password = password_hash("1212ssdfsd3", PASSWORD_DEFAULT);
//    $user->first_name = "Tester";
//    $user->last_name = "tester";
//    $user->last_login = time();
//    $user->permissions = 999999;
//    R::store($user);

//    return genToken();


//    return json_encode([
//        'code' => 1,
//        'username' => 'success',
//        'password' => 'success',
//        'errorMessage' => "oopppps"
//    ]);
});
$r->post('/access', function () {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($_COOKIE['_priceT']) || !$_COOKIE['_priceT']) {
        return json_encode([
            'code' => -2,
        ]);
    } else {
        $accessToken = $_COOKIE['_priceT'];
        $hasToken = R::findOne('tokens', 'token = ?', [$accessToken]);
        if (empty($hasToken)) {
            return json_encode([
                'code' => -2,
            ]);
        } else {
            if ($data['user_id'] != $hasToken['user_id']) {
                return json_encode([
                    'code' => -2,
                ]);
            } else {
                switch ($data['page']) {
                    case 'home':
                        return json_encode([
                            'code' => 0,
                        ]);
                    case 'users':
                        return json_encode([
                            'code' => -2,
                        ]);
                    case 'reports':
                        return json_encode([
                            'code' => 0,
                        ]);
                    case 'files':
                        return json_encode([
                            'code' => -2,
                        ]);
                    default:
                        return json_encode([
                            'code' => -2,
                        ]);
                }
            }
        }
    }
});
$r->dispatch();