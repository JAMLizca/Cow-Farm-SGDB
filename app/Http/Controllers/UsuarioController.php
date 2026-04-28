<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UsuarioController extends Controller
{
    // Listar todos los usuarios de una finca
    public function index(Request $request)
    {
        $usuarios = Usuario::where('finca_id', $request->finca_id)
                           ->get();

        return response()->json($usuarios, 200);
    }

    // Mostrar un usuario
    public function show($id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        return response()->json($usuario, 200);
    }

    // Crear un usuario
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'finca_id' => 'required|exists:fincas,id',
            'nombre'   => 'required|string',
            'password' => 'required|string|min:6',
            'rol'      => 'required|in:admin,empleado',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $validator->errors()
            ], 422);
        }

        $usuario = Usuario::create([
            'finca_id' => $request->finca_id,
            'nombre'   => $request->nombre,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'rol'      => $request->rol,
            'activo'   => true,
        ]);

        return response()->json([
            'message' => 'Usuario creado correctamente',
            'usuario' => $usuario
        ], 201);
    }

    // Actualizar un usuario
    public function update(Request $request, $id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        if ($request->password) {
            $request->merge([
                'password' => Hash::make($request->password)
            ]);
        }

        $usuario->update($request->all());

        return response()->json([
            'message' => 'Usuario actualizado correctamente',
            'usuario' => $usuario
        ], 200);
    }

    // Eliminar un usuario
    public function destroy($id)
    {
        $usuario = Usuario::find($id);

        if (!$usuario) {
            return response()->json([
                'message' => 'Usuario no encontrado'
            ], 404);
        }

        $usuario->update(['activo' => false]);

        return response()->json([
            'message' => 'Usuario eliminado correctamente'
        ], 200);
    }
}