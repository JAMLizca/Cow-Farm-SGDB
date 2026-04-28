<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Alimentacion;
use Illuminate\Support\Facades\Validator;

class AlimentacionController extends Controller
{
    // Listar todos los registros de alimentacion de una finca
    public function index(Request $request)
    {
        $alimentaciones = Alimentacion::with(['lote', 'usuario'])
                                       ->where('finca_id', $request->finca_id)
                                       ->orderBy('fecha', 'desc')
                                       ->get();

        return response()->json($alimentaciones, 200);
    }

    // Mostrar un registro
    public function show($id)
    {
        $alimentacion = Alimentacion::with(['lote', 'usuario'])
                                    ->find($id);

        if (!$alimentacion) {
            return response()->json([
                'message' => 'Registro no encontrado'
            ], 404);
        }

        return response()->json($alimentacion, 200);
    }

    // Registrar alimentacion
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'finca_id'      => 'required|exists:fincas,id',
            'lote_id'       => 'required|exists:lotes,id',
            'usuario_id'    => 'required|exists:usuarios,id',
            'tipo_alimento' => 'required|string',
            'cantidad_kg'   => 'required|numeric|min:0',
            'fecha'         => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $validator->errors()
            ], 422);
        }

        $alimentacion = Alimentacion::create($request->all());

        return response()->json([
            'message'      => 'Alimentación registrada correctamente',
            'alimentacion' => $alimentacion
        ], 201);
    }

    // Actualizar registro
    public function update(Request $request, $id)
    {
        $alimentacion = Alimentacion::find($id);

        if (!$alimentacion) {
            return response()->json([
                'message' => 'Registro no encontrado'
            ], 404);
        }

        $alimentacion->update($request->all());

        return response()->json([
            'message'      => 'Alimentación actualizada correctamente',
            'alimentacion' => $alimentacion
        ], 200);
    }

    // Eliminar registro
    public function destroy($id)
    {
        $alimentacion = Alimentacion::find($id);

        if (!$alimentacion) {
            return response()->json([
                'message' => 'Registro no encontrado'
            ], 404);
        }

        $alimentacion->delete();

        return response()->json([
            'message' => 'Alimentación eliminada correctamente'
        ], 200);
    }
}