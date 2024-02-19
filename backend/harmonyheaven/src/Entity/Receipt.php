<?php

namespace App\Entity;

use App\Repository\ReceiptRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ReceiptRepository::class)]
class Receipt
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'receipt', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Command $command = null;

    #[ORM\Column(length: 255)]
    private ?string $receipt_number = null;

    #[ORM\Column]
    private ?int $productId = null;

    #[ORM\Column]
    private ?int $quantity = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCommand(): ?Command
    {
        return $this->command;
    }

    public function setCommand(Command $command): static
    {
        $this->command = $command;

        return $this;
    }

    public function getReceiptNumber(): ?string
    {
        return $this->receipt_number;
    }

    public function setReceiptNumber(string $receipt_number): static
    {
        $this->receipt_number = $receipt_number;

        return $this;
    }

    public function getProductId(): ?int
    {
        return $this->productId;
    }

    public function setProductId(int $productId): static
    {
        $this->productId = $productId;

        return $this;
    }

    public function getQuantity(): ?int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): static
    {
        $this->quantity = $quantity;

        return $this;
    }
}
