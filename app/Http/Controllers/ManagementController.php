<?php

namespace App\Http\Controllers;

use App\Models\Food;
use App\Models\User;
use App\Models\Catagory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $results = User::selectRaw("YEAR(created_at) as year, MONTH(created_at) as month, DAY(created_at) as day, DAYNAME(created_at) as weekday, COUNT(*) as total")
            ->groupBy('year', 'month', 'day', 'weekday')
            ->orderBy('year')
            ->orderBy('month')
            ->orderBy('day')
            ->get();
        $Foods = DB::table('foods')
            ->join('catagory', 'foods.catagory_id', '=', 'catagory.id')
            ->select('foods.*', 'catagory.name as category_name')
            ->orderBy('foods.id', 'desc')
            ->paginate(10);
        $categories = db::table('catagory')->get();
        $avgCalories = DB::table('foods')
            ->selectRaw('ROUND(AVG(calories), 0) as avg_calories')
            ->first();
        $avgCalories = $avgCalories->avg_calories;
        $totalUsers = User::count();
        $totalFoods = DB::table('foods')->count();
        return Inertia::render('Kinraidee/Management', [
            'Foods' => $Foods,
            'catagorys' => $categories,
            'lastPage' => $Foods->lastPage(),
            'currentPage' => $Foods->currentPage(),
            'users' => $results,
            'totalUsers' => $totalUsers,
            'totalFoods' => $totalFoods,
            'avgCalories' => $avgCalories,

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $food =
            $request->validate([
                'name' => 'required|string|max:255',
                'category_id' => 'required|numeric',
                'calories' => 'required|numeric',
                'protein' => 'required|decimal:0,2',
                'carbs' => 'required|decimal:0,2',
                'fats' => 'required|decimal:0,2',
                'serving_size' => 'required|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);



        $imagePath = null;
        if ($request->hasFile('image')) {
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('photos'), $imageName);
            $imagePath = '/photos/' . $imageName;
        }


        // 3. Create new food record
        $food = food::create([
            'name' => $request->name,
            'catagory_id' => $request->category_id,
            'calories' => $request->calories,
            'protein' => $request->protein,
            'carbs' => $request->carbs,
            'fats' => $request->fats,
            'serving_size' => $request->serving_size,
            'image' => $imagePath
        ]);

        // 4. Return response
        return redirect()->back()->with('success', 'Food added successfully');


    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        Log::info('Update food request data:', $request->all());

        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|numeric',
            'calories' => 'required|numeric',
            'protein' => 'required|decimal:0,2',
            'carbs' => 'required|decimal:0,2',
            'fats' => 'required|decimal:0,2',
            'serving_size' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $food = food::findOrFail($id);

        $updateData = [
            'name' => $request->name,
            'catagory_id' => $request->category_id,
            'calories' => $request->calories,
            'protein' => $request->protein,
            'carbs' => $request->carbs,
            'fats' => $request->fats,
            'serving_size' => $request->serving_size,
        ];

        try {
            if ($request->hasFile('image')) {
                if ($food->image && file_exists(public_path($food->image))) {
                    unlink(public_path($food->image));
                }

                $imageName = time() . '.' . $request->image->extension();
                $request->image->move(public_path('photos'), $imageName);
                $updateData['image'] = '/photos/' . $imageName;
            }

            $food->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Food updated successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating food: ' . $e->getMessage());
            return response()->json([
                'error' => true,
                'message' => 'Food updated failed'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $food = food::findOrFail($id);
        $food->delete();

        return redirect()->back();
    }
}
