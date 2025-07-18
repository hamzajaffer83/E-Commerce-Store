<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'parent_id'];

    // Parent category
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // Child categories
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Recursive children (for nested levels)
    public function childrenRecursive()
    {
        return $this->children()->with('childrenRecursive');
    }
}
