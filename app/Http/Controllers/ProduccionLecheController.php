<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProduccionLeche;
use Illuminate\Support\Facades\Validator;

class ProduccionLecheController extends Controller
{
    // Listar todos los registros de produccion de una finca
    public function index(Request $request)
    {
        $producciones = ProduccionLeche::with(['bovino', 'usuario'])
                                       ->where('finca_id', $request->finca_id)
                                       ->orderBy('fecha', 'desc')
                                       ->get();

        return response()->json($producciones, 200);
    }

    // Mostrar un registro
    public function show($id)
    {
        $produccion = ProduccionLeche::with(['bovino', 'usuario'])
                                     ->find($id);

        if (!$produccion) {
            return response()->json([
                'message' => 'Registro no encontrado'
            ], 404);
        }

        return response()->json($produccion, 200);
    }

    // Registrar produccion
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'finca_id'        => 'required|exists:fincas,id',
            'bovino_id'       => 'required|exists:bovinos,id',
            'usuario_id'      => 'required|exists:usuarios,id',
            'fecha'           => 'required|date',
            'turno'           => 'required|in:Mañana,Tarde,Noche',
            'cantidad_litros' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Error de validación',
                'errors'  => $validator->errors()
            ], 422);
        }

        $produccion = ProduccionLeche::create($request->all());

        return response()->json([
            'message'    => 'Producción registrada correctamente',
            'produccion' => $produccion
        ], 201);
    }

    // Actualizar registro
    public function update(Request $request, $id)
    {
        $produccion = ProduccionLeche::find($id);

        if (!$produccion) {
            return response()->json([
                'message' => 'Registro no encontrado'
            ], 404);
        }

        $produccion->update($request->all());

        return response()->json([
            'message'    => 'Producción actualizada correctamente',
            'produccion' => $produccion
        ], 200);
    }

    // Eliminar registro
    public function destroy($id)
    {
        $produccion = ProduccionLeche::find($id);

        if (!$produccion) {
            return response()->json([
                'message' => 'Registro no encontrado'
            ], 404);
        }

        $produccion->delete();

        return response()->json([
            'message' => 'Producción eliminada correctamente'
        ], 200);
    }
}