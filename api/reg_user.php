<?php
// Incluir un archivo de conexión a la base de datos
require_once './core/DBConfig.php';
// Crear variable de sesión
session_start();

// Verificar método POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Validar y sanitizar datos
$required_fields = ['first_name', 'last_name', 'phone', 'username', 'email', 'password'];
foreach ($required_fields as $field) {
    if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => "Missing required field: $field"]);
        exit;
    }
}

// Obtener datos
$data = [
    'first_name' => filter_var($_POST['first_name'], FILTER_SANITIZE_FULL_SPECIAL_CHARS),
    'last_name' => filter_var($_POST['last_name'], FILTER_SANITIZE_FULL_SPECIAL_CHARS),
    'phone' => preg_replace('/[^0-9+]/', '', $_POST['phone']),
    'username' => filter_var($_POST['username'], FILTER_SANITIZE_FULL_SPECIAL_CHARS),
    'email' => filter_var($_POST['email'], FILTER_SANITIZE_EMAIL),
    'password' => $_POST['password']
];

// Validar email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
    exit;
}

// Encriptar contraseña
$hashed_password = password_hash($data['password'], PASSWORD_BCRYPT);

try {
    // Crear conexión a la base de datos
    $auth = new DBconfig();
    $db = $auth->getConnection();
    
    // Verificar si el email o username ya existen
    $sql = "SELECT * FROM users WHERE email = :email OR username = :username OR phone = :phone";
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':email' => $data['email'],
        ':username' => $data['username'],
        ':phone' => $data['phone']
    ]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Email, username or phone already in use.'
        ]);
        exit;
    }
    
    // Insertar nuevo usuario
    $sql = "INSERT INTO users (first_name, last_name, phone, username, email, password) 
            VALUES (:first_name, :last_name, :phone, :username, :email, :password)";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':first_name' => $data['first_name'],
        ':last_name' => $data['last_name'],
        ':phone' => $data['phone'],
        ':username' => $data['username'],
        ':email' => $data['email'],
        ':password' => $hashed_password
    ]);
    
    // Obtener el ID del usuario recién creado
    $user_id = $db->lastInsertId();
    
    // Crear sesión
    $_SESSION['user_id'] = $user_id;
    $_SESSION['username'] = $data['username'];
    
    echo json_encode([
        'status' => 'success',
        'message' => 'User registered successfully.',
        'user_id' => $user_id
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    error_log("Database error: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>