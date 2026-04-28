<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lote;
use Illuminate\Support\Facades\Validator;

class LoteController extends Controller
{
    // Listar todos los lotes de una finca
    public function index(Request $request)
    {
        $lotes = Lote::where('finca_id', $request->finca_id)
                     ->where('activo', true)
                     ->get();

        return response()->json($lotes, 200);
    }

    // Mostrar un lote
    public function show($id)
    {
        $lote = Lote::with('bovinos')
                    ->find($id);

        if (!$lote) {
            return response()->json([
                'message' => 'Lote no encontrado'
            ], 404);
        }

        return response()->json($lote, 200);
    }

    // Crear un lote
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'finca_id'  => 'required|exists:fincas,id',
            'nombre'    => 'required|string',
            'capacidad' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $validator->errors()
            ], 422);
        }

        $lote = Lote::create($request->all());

        return response()->json([
            'message' => 'Lote creado correctamente',
            'lote'    => $lote
        ], 201);
    }

    // Actualizar un lote
    public function update(Request $request, $id)
    {
        $lote = Lote::find($id);

        if (!$lote) {
            return response()->json([
                'message' => 'Lote no encontrado'
            ], 404);
        }

        $lote->update($request->all());

        return response()->json([
            'message' => 'Lote actualizado correctamente',
            'lote'    => $lote
        ], 200);
    }

    // Eliminar un lote
    public function destroy($id)
    {
        $lote = Lote::find($id);

        if (!$lote) {
            return response()->json([
                'message' => 'Lote no encontrado'
            ], 404);
        }

        $lote->update(['activo' => false]);

        return response()->json([
            'message' => 'Lote eliminado correctamente'
        ], 200);
    }
}