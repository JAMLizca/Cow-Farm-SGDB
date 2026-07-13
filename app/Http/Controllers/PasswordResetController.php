<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use App\Models\Finca;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    // ── Solicitar restablecimiento ──
    public function solicitar(Request $request)
    {
        $request->validate([
            'codigo_finca' => 'required|string',
            'email'        => 'required|email',
        ]);

        // Verificar que la finca existe
        $finca = Finca::where('codigo_finca', $request->codigo_finca)
                      ->where('activo', true)
                      ->first();

        if (!$finca) {
            return response()->json([
                'message' => 'Codigo de finca incorrecto o finca inactiva.'
            ], 404);
        }

        // Verificar que el usuario existe en esa finca
        $usuario = Usuario::where('finca_id', $finca->id)
                          ->where('email', $request->email)
                          ->where('activo', true)
                          ->first();

        if (!$usuario) {
            return response()->json([
                'message' => 'No encontramos una cuenta con ese correo en esta finca.'
            ], 404);
        }

        // Generar token
        $token   = Str::random(64);
        $expira  = now()->addMinutes(30);

        $usuario->update([
            'reset_token'            => $token,
            'reset_token_expires_at' => $expira,
        ]);

        // URL de restablecimiento
        $resetUrl = url("/reset-password.html?token={$token}&email={$request->email}&finca={$request->codigo_finca}");

        // Enviar correo
        Mail::to($usuario->email)->send(
            new ResetPasswordMail($usuario->nombre, $finca->nombre, $resetUrl)
        );

        return response()->json([
            'message' => 'Correo enviado correctamente. Revisa tu bandeja de entrada.'
        ], 200);
    }

    // Restalecer contraseña
    public function restablecer(Request $request)
    {
        $request->validate([
            'token'        => 'required|string',
            'email'        => 'required|email',
            'password'     => 'required|string|min:6',
        ]);

        $usuario = Usuario::where('email', $request->email)
                          ->where('reset_token', $request->token)
                          ->first();

        if (!$usuario) {
            return response()->json([
                'message' => 'Token invalido o correo incorrecto.'
            ], 400);
        }

        if (now()->isAfter($usuario->reset_token_expires_at)) {
            return response()->json([
                'message' => 'El enlace ha expirado. Solicita uno nuevo.'
            ], 400);
        }

        $usuario->update([
            'password'               => Hash::make($request->password),
            'reset_token'            => null,
            'reset_token_expires_at' => null,
        ]);

        return response()->json([
            'message' => 'Contrasena restablecida correctamente. Ya puedes iniciar sesion.'
        ], 200);
    }
}