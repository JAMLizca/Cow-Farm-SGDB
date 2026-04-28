<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Finca;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Login
    public function login(Request $request)
    {
        $request->validate([
            'codigo_finca' => 'required|string',
            'nombre'       => 'required|string',
            'password'     => 'required|string',
        ]);

        // Verificar que la finca existe
        $finca = Finca::where('codigo_finca', $request->codigo_finca)
                      ->where('activo', true)
                      ->first();

        if (!$finca) {
            return response()->json([
                'message' => 'Código de finca incorrecto'
            ], 401);
        }

        // Verificar usuario dentro de esa finca
        $usuario = Usuario::where('finca_id', $finca->id)
                          ->where('nombre', $request->nombre)
                          ->where('activo', true)
                          ->first();

        if (!$usuario || !Hash::check($request->password, $usuario->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        return response()->json([
            'message' => 'Login exitoso',
            'usuario' => [
                'id'     => $usuario->id,
                'nombre' => $usuario->nombre,
                'rol'    => $usuario->rol,
            ],
            'finca' => [
                'id'     => $finca->id,
                'nombre' => $finca->nombre,
            ],
        ], 200);
    }
}