<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Auditoria;

class AuditoriaController extends Controller
{
    public function index(Request $request)
    {
        $query = Auditoria::with(['finca', 'usuario'])
                          ->orderBy('created_at', 'desc');

        if ($request->finca_id) {
            $query->where('finca_id', $request->finca_id);
        }

        if ($request->modulo) {
            $query->where('modulo', $request->modulo);
        }

        if ($request->accion) {
            $query->where('accion', $request->accion);
        }

        if ($request->fecha_desde) {
            $query->whereDate('created_at', '>=', $request->fecha_desde);
        }

        if ($request->fecha_hasta) {
            $query->whereDate('created_at', '<=', $request->fecha_hasta);
        }

        $registros = $query->limit(500)->get();

        return response()->json($registros, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'finca_id'      => 'required|exists:fincas,id',
            'usuario_id'    => 'nullable|exists:usuarios,id',
            'nombre_usuario'=> 'required|string',
            'rol_usuario'   => 'required|string',
            'accion'        => 'required|string',
            'modulo'        => 'required|string',
            'descripcion'   => 'nullable|string',
        ]);

        $auditoria = Auditoria::create([
            'finca_id'       => $request->finca_id,
            'usuario_id'     => $request->usuario_id,
            'nombre_usuario' => $request->nombre_usuario,
            'rol_usuario'    => $request->rol_usuario,
            'accion'         => $request->accion,
            'modulo'         => $request->modulo,
            'descripcion'    => $request->descripcion,
            'ip'             => $request->ip(),
        ]);

        return response()->json([
            'message'   => 'Registro de auditoria guardado',
            'auditoria' => $auditoria,
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        // Solo superadmin puede borrar
        $user = $request->header('X-SuperAdmin-User');
        $pass = $request->header('X-SuperAdmin-Pass');

        if ($user !== env('SUPERADMIN_USER') || $pass !== env('SUPERADMIN_PASSWORD')) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        Auditoria::where('finca_id', $id)->delete();

        return response()->json([
            'message' => 'Historial eliminado correctamente'
        ], 200);
    }
}