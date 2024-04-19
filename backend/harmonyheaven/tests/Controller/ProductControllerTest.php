<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ProductControllerTest extends WebTestCase
{
    /**
     * @covers ::getProducts
     */
    public function testGetProducts(): void
    {
        $client = static::createClient();
        $client->request('GET', '/products-list');

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);

        // Add more assertions to check the JSON structure and data if needed
    }
    /**
     * @covers ::getProductById
     */
    public function testGetProductById(): void
    {
        $client = static::createClient();
        $client->request('GET', '/product/1'); // Assuming product ID 1 exists

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);

        // Add more assertions to check the JSON structure and data if needed
    }

    /**
     * @covers ::getProductByInvalidId
     */
    public function testGetProductByInvalidId(): void
    {
        $client = static::createClient();
        $client->request('GET', '/product/99999'); // Assuming product ID 99999 doesn't exist

        $this->assertResponseStatusCodeSame(404);
    }
}
