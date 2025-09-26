Seeding a Laravel DB with Irish Counties
06/06/2024
laravel
---


This is a step-by-step guide on how to seed your database with Irish Counties grouped by their Province.

<!-- more -->

## Step 1 - Province Migration

```
php artisan make:migration create_provinces_table
```

All we need from a `Province` is it's name.

```php
Schema::create('provinces', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->timestamps();
});
```

## Step 2 - County Migration

```
php artisan make:migration create_counties_table
```

As well as a name a `County` will hold a reference to the `Province` it belongs to.

```php
Schema::create('counties', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->foreignIdFor(Province::class);
    $table->timestamps();
});
```

## Step 3 - Province Model

```
php artisan make:model Province
```

Here we add `name` as a fillable property and set up the `HasMany` relationship with `County`.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Province extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function counties(): HasMany
    {
        return $this->hasMany(County::class);
    }
}
```

## Step 4 - County Model

```
php artisan make:model County
```

Here we add `name` and `province_id` as a fillable property and set up the `BelongsTo` relationship with `Province`.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class County extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'province_id'];

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }
}
```

## Step 5 - Province Seeder

```
php artisan make:seeder ProvinceSeeder
```

The `ProvinceSeeder` will create a record for each of Ireland's provinces and will attach the relevant counties.

```php
<?php

namespace Database\Seeders;

use App\Models\Province;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProvinceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $irishCounties = [
            'Leinster' => [
                'Carlow',
                'Dublin',
                'Kildare',
                'Kilkenny',
                'Laois',
                'Longford',
                'Louth',
                'Meath',
                'Offaly',
                'Westmeath',
                'Wexford',
                'Wicklow'
            ],
            'Munster' => [
                'Clare',
                'Cork',
                'Kerry',
                'Limerick',
                'Tipperary',
                'Waterford'
            ],
            'Connacht' => [
                'Galway',
                'Leitrim',
                'Mayo',
                'Roscommon',
                'Sligo'
            ],
            'Ulster' => [
                'Antrim',
                'Armagh',
                'Cavan',
                'Derry',
                'Donegal',
                'Down',
                'Fermanagh',
                'Monaghan',
                'Tyrone'
            ]
        ];

        foreach ($irishCounties as $provinceName => $countyNames) {
            $province = Province::firstOrCreate(['name' => $provinceName]);
            foreach ($countyNames as $countyName) {
                $province->counties()->firstOrCreate(['name' => $countyName]);
            }
        }
    }
}
```

## Step 6 - Run Seeder

```
php artisan db:seed --class=ProvinceSeeder
```

As the provinces and counties will not change, the seeder will only need run once.
