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

    }
    /**
     * @covers ::getProductById
     */
    public function testGetProductById(): void
    {
        $client = static::createClient();
        $client->request('GET', '/product/1'); // product ID 1 exists

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);


    }

    /**
     * @covers ::getProductByInvalidId
     */
    public function testGetProductByInvalidId(): void
    {
        $client = static::createClient();
        $client->request('GET', '/product/99999'); // product ID 99999 doesn't exist

        $this->assertResponseStatusCodeSame(404);
    }
}
