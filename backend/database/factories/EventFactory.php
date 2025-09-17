<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startTime = $this->faker->dateTimeBetween('+1 day', '+30 days');
        $endTime = (clone $startTime)->modify('+2 hours');

        return [
            'name' => $this->faker->sentence(3),
            'location' => $this->faker->address,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'max_capacity' => $this->faker->numberBetween(10, 500),
            'description' => $this->faker->optional()->paragraph,
        ];
    }
}
