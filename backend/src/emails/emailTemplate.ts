export function createWelcomeEmailTemplate(name: string, clientURL: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Echo</title>
  <style>
    :root{
      
    }
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      padding: 40px;
      border-radius: 8px;
    }
    .button {
      display: inline-block;
      margin-top: 24px;
      padding: 12px 24px;
      background-color: #000000;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 4px;
      font-size: 14px;
    }
    .footer {
      margin-top: 40px;
      font-size: 12px;
      color: #999999;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hey, ${name}!</h2>
    <p>Welcome to <strong>Echo</strong>. Your account is ready to go.</p>
    <p>Click the button below to get started:</p>
    <a class="button" href="${clientURL}">Open Echo</a>
    <div class="footer">
      <p>If you didn't create an account, you can safely ignore this email.</p>
      <p>&copy; ${new Date().getFullYear()} Echo. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
