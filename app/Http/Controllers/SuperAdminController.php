<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Finca;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;

class SuperAdminController extends Controller
{
    // Verificar credenciales superadmin
    private function verificar(Request $request)
    {
        $user = $request->header('X-SuperAdmin-User');
        $pass = $request->header('X-SuperAdmin-Pass');

        return $user === env('SUPERADMIN_USER') &&
               $pass === env('SUPERADMIN_PASSWORD');
    }

    // Login
    public function login(Request $request)
    {
        $request->validate([
            'usuario'    => 'required|string',
            'password'   => 'required|string',
        ]);

        if (
            $request->usuario  === env('SUPERADMIN_USER') &&
            $request->password === env('SUPERADMIN_PASSWORD')
        ) {
            return response()->json([
                'message' => 'Acceso concedido',
                'token'   => base64_encode(env('SUPERADMIN_USER') . ':' . env('SUPERADMIN_PASSWORD')),
            ], 200);
        }

        return response()->json([
            'message' => 'Credenciales incorrectas'
        ], 401);
    }

    // Listar fincas 
    public function index(Request $request)
    {
        if (!$this->verificar($request)) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $fincas = Finca::withCount('usuarios')
                       ->orderBy('created_at', 'desc')
                       ->get();

        return response()->json($fincas, 200);
    }

    // Crear finca 
    public function store(Request $request)
    {
        if (!$this->verificar($request)) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $request->validate([
            'codigo_finca' => 'required|string|unique:fincas,codigo_finca',
            'nombre'       => 'required|string',
            'password'     => 'required|string|min:6',
            'propietario'  => 'required|string',
            'telefono'     => 'nullable|string',
            'direccion'    => 'nullable|string',
        ]);

        $finca = Finca::create([
            'codigo_finca' => $request->codigo_finca,
            'nombre'       => $request->nombre,
            'password'     => Hash::make($request->password),
            'propietario'  => $request->propietario,
            'telefono'     => $request->telefono,
            'direccion'    => $request->direccion,
            'activo'       => true,
        ]);

        // Crear admin automáticamente
        if ($request->admin_nombre && $request->admin_password) {
            Usuario::create([
                'finca_id' => $finca->id,
                'nombre'   => $request->admin_nombre,
                'password' => Hash::make($request->admin_password),
                'rol'      => 'admin',
                'activo'   => true,
            ]);
        }

        return response()->json([
            'message' => 'Finca creada correctamente',
            'finca'   => $finca,
        ], 201);
    }

    // Actualizar fica
    public function update(Request $request, $id)
    {
        if (!$this->verificar($request)) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $finca = Finca::find($id);

        if (!$finca) {
            return response()->json(['message' => 'Finca no encontrada'], 404);
        }

        if ($request->password) {
            $request->merge(['password' => Hash::make($request->password)]);
        } else {
            $request->request->remove('password');
        }

        $finca->update($request->all());

        return response()->json([
            'message' => 'Finca actualizada correctamente',
            'finca'   => $finca,
        ], 200);
    }

    // Activar / Desactivar finca 
    public function toggleActivo(Request $request, $id)
    {
        if (!$this->verificar($request)) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $finca = Finca::find($id);

        if (!$finca) {
            return response()->json(['message' => 'Finca no encontrada'], 404);
        }

        $finca->update(['activo' => !$finca->activo]);

        return response()->json([
            'message' => $finca->activo ? 'Finca activada' : 'Finca desactivada',
            'finca'   => $finca,
        ], 200);
    }

    // Eliminar finca 
    public function destroy(Request $request, $id)
    {
        if (!$this->verificar($request)) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $finca = Finca::find($id);

        if (!$finca) {
            return response()->json(['message' => 'Finca no encontrada'], 404);
        }

        $finca->delete();

        return response()->json([
            'message' => 'Finca eliminada correctamente'
        ], 200);
    }

    // Listar usuarios de una finca 
    public function usuarios(Request $request, $id)
    {
        if (!$this->verificar($request)) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        $usuarios = Usuario::where('finca_id', $id)->get();

        return response()->json($usuarios, 200);
    }
}