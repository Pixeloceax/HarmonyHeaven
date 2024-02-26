<?php

namespace App\Entity;

use App\Repository\CommandRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CommandRepository::class)]
class Command
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'commands')]
    private ?User $user = null;

    #[ORM\OneToMany(mappedBy: 'command', targetEntity: CommandItem::class, cascade: ['persist'])]
    private Collection $command_item;

    #[ORM\OneToOne(mappedBy: 'command', cascade: ['persist', 'remove'])]
    private ?Receipt $receipt = null;

    #[ORM\OneToOne(inversedBy: 'command', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: true, unique: false)]
    private ?Payment $payment = null;

    #[ORM\OneToOne(inversedBy: 'command', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Delivery $delivery = null;

    #[ORM\Column(type: Types::SMALLINT)]
    private ?int $statut = null;

    public function __construct()
    {
        $this->command_item = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    /**
     * @return Collection<int, CommandItem>
     */
    public function getCommandItem(): Collection
    {
        return $this->command_item;
    }

    public function addCommandItem(CommandItem $commandItem): static
    {
        if (!$this->command_item->contains($commandItem)) {
            $this->command_item->add($commandItem);
            $commandItem->setCommand($this);
        }

        return $this;
    }

    public function removeCommandItem(CommandItem $commandItem): static
    {
        if ($this->command_item->removeElement($commandItem)) {
            // set the owning side to null (unless already changed)
            if ($commandItem->getCommand() === $this) {
                $commandItem->setCommand(null);
            }
        }

        return $this;
    }

    public function getReceipt(): ?Receipt
    {
        return $this->receipt;
    }

    public function setReceipt(Receipt $receipt): static
    {
        // set the owning side of the relation if necessary
        if ($receipt->getCommand() !== $this) {
            $receipt->setCommand($this);
        }

        $this->receipt = $receipt;

        return $this;
    }

    public function getPayment(): ?Payment
    {
        return $this->payment;
    }

    public function setPayment(Payment $payment): static
    {
        $this->payment = $payment;

        return $this;
    }

    public function getDelivery(): ?Delivery
    {
        return $this->delivery;
    }

    public function setDelivery(Delivery $delivery): static
    {
        $this->delivery = $delivery;

        return $this;
    }

    public function getStatut(): ?int
    {
        return $this->statut;
    }

    public function setStatut(int $statut): static
    {
        $this->statut = $statut;

        return $this;
    }

}
