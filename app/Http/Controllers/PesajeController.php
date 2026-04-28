<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pesaje;
use Illuminate\Support\Facades\Validator;

class PesajeController extends Controller
{
    // Listar todos los pesajes de una finca
    public function index(Request $request)
    {
        $pesajes = Pesaje::with(['bovino', 'usuario'])
                         ->where('finca_id', $request->finca_id)
                         ->orderBy('fecha', 'desc')
                         ->get();

        return response()->json($pesajes, 200);
    }

    // Mostrar un pesaje
    public function show($id)
    {
        $pesaje = Pesaje::with(['bovino', 'usuario'])
                        ->find($id);

        if (!$pesaje) {
            return response()->json([
                'message' => 'Pesaje no encontrado'
            ], 404);
        }

        return response()->json($pesaje, 200);
    }

    // Registrar un pesaje
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'finca_id'   => 'required|exists:fincas,id',
            'bovino_id'  => 'required|exists:bovinos,id',
            'usuario_id' => 'required|exists:usuarios,id',
            'fecha'      => 'required|date',
            'peso_kg'    => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $validator->errors()
            ], 422);
        }

        $pesaje = Pesaje::create($request->all());

        return response()->json([
            'message' => 'Pesaje registrado correctamente',
            'pesaje'  => $pesaje
        ], 201);
    }

    // Actualizar un pesaje
    public function update(Request $request, $id)
    {
        $pesaje = Pesaje::find($id);

        if (!$pesaje) {
            return response()->json([
                'message' => 'Pesaje no encontrado'
            ], 404);
        }

        $pesaje->update($request->all());

        return response()->json([
            'message' => 'Pesaje actualizado correctamente',
            'pesaje'  => $pesaje
        ], 200);
    }

    // Eliminar un pesaje
    public function destroy($id)
    {
        $pesaje = Pesaje::find($id);

        if (!$pesaje) {
            return response()->json([
                'message' => 'Pesaje no encontrado'
            ], 404);
        }

        $pesaje->delete();

        return response()->json([
            'message' => 'Pesaje eliminado correctamente'
        ], 200);
    }
}