<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $name = $_POST['name'] ?? '';
  $email = $_POST['email'] ?? '';

  if ($name !== '' && filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $data = "Name: $name\nEmail: $email\n";
    file_put_contents('form-data.txt', $data, FILE_APPEND | LOCK_EX);
    echo 'Form data saved successfully!';
  } else {
    echo 'Invalid data. Please try again.';
  }
} else {
  echo 'Method not allowed.';
}
?>