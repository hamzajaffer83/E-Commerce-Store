<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SecretKey;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class SecretKeyController extends Controller
{
    public function index(){
        // $apiKey = Str::uuid()->toString();
        
        // SecretKey::create([
        //     'key' => $apiKey
        // ]);

        // dd("You Api Secret Key Created Successfully");

        $apiKey = SecretKey::first();

        dd("You Secret Api Key is:". $apiKey->key);

    }
}
