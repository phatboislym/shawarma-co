from typing import Optional


class Item():
    """
    Class that defines an item object
    """

    def __init__(self, id_: int, name: str, description: str, price: int,
                 on_offer: bool, discount: Optional[int] = None) -> None:
        self.id_ = id_
        self.name = name
        self.description = description
        self.price = price
        self.on_offer = on_offer
        self.discount = discount

    def __repr__(self) -> str:
        """returns a string representation of the item object"""
        return f"Item(id_={self.id_}, name='{self.name}', description='{self.description}', " \
               f"price={self.price}, on_offer={self.on_offer}, discount={self.discount})"
