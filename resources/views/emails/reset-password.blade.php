<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablecer contraseña</title>
  <style>
    body { margin:0; padding:0; background:#f4f6f8; font-family:'Segoe UI',sans-serif; }
    .wrapper { max-width:560px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
    .header { background:#1a2332; padding:32px 40px; text-align:center; }
    .header h1 { margin:0; color:#ffffff; font-size:22px; font-weight:700; }
    .header p { margin:6px 0 0; color:rgba(255,255,255,0.6); font-size:13px; }
    .body { padding:36px 40px; }
    .body h2 { color:#1a2332; font-size:18px; margin:0 0 12px; }
    .body p { color:#5a6a7e; font-size:14px; line-height:1.7; margin:0 0 20px; }
    .btn-wrap { text-align:center; margin:28px 0; }
    .btn { display:inline-block; padding:14px 32px; background:#1a8f3c; color:#ffffff; text-decoration:none; border-radius:10px; font-size:15px; font-weight:600; }
    .note { background:#f4f6f8; border-radius:10px; padding:16px; font-size:12px; color:#5a6a7e; line-height:1.6; }
    .note strong { color:#1a2332; }
    .footer { background:#f4f6f8; padding:20px 40px; text-align:center; }
    .footer p { margin:0; color:#aab4c0; font-size:12px; }
    .footer strong { color:#1a8f3c; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>SGDB — Cow Farm</h1>
      <p>Sistema de Gestión de Bovinos</p>
    </div>
    <div class="body">
      <h2>Hola, {{ $nombreUsuario }}</h2>
      <p>
        Recibimos una solicitud para restablecer la contraseña de tu cuenta en la finca
        <strong>{{ $nombreFinca }}</strong>.
      </p>
      <p>
        Haz clic en el botón de abajo para crear una nueva contraseña. Este enlace
        es válido por <strong>30 minutos</strong>.
      </p>
      <div class="btn-wrap">
        <a href="{{ $resetUrl }}" class="btn">Restablecer contraseña</a>
      </div>
      <div class="note">
        <strong>¿No solicitaste este cambio?</strong><br>
        Si no solicitaste restablecer tu contraseña, puedes ignorar este correo.
        Tu contraseña actual seguirá siendo la misma y no habrá ningún cambio en tu cuenta.
      </div>
    </div>
    <div class="footer">
      <p>© 2026 <strong>SGDB Cow Farm</strong> — Sistema de Gestión de Bovinos</p>
    </div>
  </div>
</body>
</html>