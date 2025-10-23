import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const produtos = [
    // Masculino
    {
        id: "1",
        nome: "Jordan Zion 4",
        preco: 1199.90,
        desconto: "10% off",
        imagem: "https://olies-ports.s3.us-east-1.amazonaws.com/img/produto-categoria1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY44ABABHFK%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T215352Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJIMEYCIQCBCAXnc6gcVVXbxRzyhlxiQIKFBfd8ebnJK%2BEDC63KIAIhAMnQ4fKGwicfAZAMujuHcprjZZDoDa2Zyptm3dhCZl1UKoMDCDcQABoMNjcxMDU0NDk3MzM3IgwhlaRKJY%2BU9FvlQNYq4AJLAD64cmkWYd4wwAJklp6bULy%2Bpu7xNAz3QPuq4cizmloq9%2BOKWiEWv3WLtVa4Oj9er9tIZ9EovFEwk9CocLIx8miD17Ek%2FXrdl4%2F%2FCfQCeekNOCbij3wzrc9VA6PWVsgFz1d%2BRyKR8XNOWlyRp1GtjAMVpXKY2jc6p%2FrYERA5zhg01AK6YnhCyc21JQkkxOlCNUf2VGN79BLIJk%2Bq%2FyvAqGMuoqHNAtHZxpwtQtOIY7K4pE1hssj3qv%2FnuNoR%2FFzlgJLu3JstGSwTeU5hEoy9Fac%2BygnKO4l%2Bt%2BXSuUFuNOA1jn%2F%2BiofatO0%2Bv0gO%2BPB9rrrew5YqnlfMlBmyJyOuA%2BggFQfjNKsnZgKwivP7ljKSXdv0OO%2FXsrJfKOdtRpDO7DNtuyMe3IRYtQ6rVbh7KcYo5%2BVLwv%2FfLhVLK1BedG3mfXC5oS5YYLEfAbGlRJquGNZGvoQ89gzkS%2BaMX0LJMIDc5McGOoYCq9Ul9Nl39NTgAFQ2vfic1EVN6JOnSPmjlxkGat48cQhjOoLBOQ23Z6a212tt4jCn9NGAra0Yv9tJY8Wi8fh1zppKwti3G2sIbdiFl7xWISsE%2BZ%2BXHyzY4fxZLrcfUCjadtcQI4GJmgNA5gOE5cTBldDsEH3C%2F53uQ5dAUNFKUopAHf9KbamsFN%2BRWb%2F%2FgRU8DSyzZ1c66OZQTWnGGyi%2BsBP%2Fie6ijBZJz%2BaloiCnExOzmi9sEF1Sb8OrIXwEA8CCSi5b%2BzNv6dpOjo9HP5l6wr5uRBESGMmjz68oG7Pv7H3xcZEeRWtTfOrBQdI8ZYUgX%2FhMmszHF0AKfijg7WsabY72jx6yCA%3D%3D&X-Amz-Signature=2e6034e9aa2465d6f17d362ca32164b1c9b154da52197f00831546863bd42171&X-Amz-SignedHeaders=host&response-content-disposition=inline",
        categoria: "Masculino",
    },
    {
        id: "2",
        nome: "Tênis Nike Flex Experience Run 12",
        preco: 1079.90,
        desconto: "10% off",
        imagem: "https://olies-ports.s3.us-east-1.amazonaws.com/img/produto-categoria2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4SECG5TAM%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T215419Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIQCaN9CyhuoOiX9myuRWYC37s%2FBaxyC90i8ubgm1bR6GeAIgH7CTLfSlkpw9%2FYccwdqErWJiiiPt4W0eMosEgUjKhtAqgwMINxAAGgw2NzEwNTQ0OTczMzciDJxlPYvgv1seLAoHKSrgAgcHvIhw5aAvWQc%2BZ4oH%2BiJfwMK9qp0B3cZNQmon8kmOR4s4BlGmIBbaI%2B3c8P88aJ7Qhjf4zVcCm1KFMi8wjKFk5n5KZojbLA6cGRfFNaKQ8%2BnKzokFdmrd6P0Jd2Uq4%2F5ZUw1eR%2FF%2BsD%2BzZdGgfwmkQyGtapI0Clgvzjag6576CWFaZ9w%2BwEOe1sbpOrKABfyFOwq3JZnok8YY3pXrzYON0%2BSYJT%2Bxly%2BkqOwfoIAlJx5ep3i9MsHI8EuhHfld5F1%2B9G1DXb%2Bg8VRxO2hJQUhB6Q58sQIRaZViQz2UhQqI9H2l0f9orq4YddBUHdhhQSAjedhLaLvIkxYiMh8G9vWxZcBv5Ch1TSQBi1G73byY3fBaiHyy%2FR03CsLvLL1uF8X7xB%2FQngjJg33jDirbuNzAJJXZDX6A2f4PnCvapBHih8yj8nFwX7mPagUxdmzHW3uiuLmOBmnGIbxocXmJzF0wgNzkxwY6hwL%2FtPIFyfFUYxThEwk1U%2F0oGmPUk6wvIJhjIbiBwXynSeMhS9SWdzjfUt8IL%2FS8WvNESqQuGOGhuD%2BrjBj4%2Fo9DbYrRNXA1yZTrc2zo7OVfBCIPyC6DS5TXdIXGqVAlQa5BQzV%2FqRrw5IgAZ0zToWFbQj3bvdd3nR%2F%2BDHpYu%2FzWnaU3q7STIkalGH1is%2F0YseXTpzP%2FzAV7jwlgvhnRMGmVsiJ1vnZu42Lds7fyZa0h4XLwjnVcPkHvFMqdOKdJA3tNpoNP0YGr5Qxoc%2B2V%2FHt63Il89J%2BX7%2B8feLKs8w2%2Bqzvko1eHkMRWSfb5W5vUHzaTldJNPA76n0VnSsSDdTmccvRPSCYDOA%3D%3D&X-Amz-Signature=6f1ad93bb65aa12d955d33971d29a97513dcbcaf6f40febbbcf420dc7788d356&X-Amz-SignedHeaders=host&response-content-disposition=inline",
        categoria: "Masculino",
    },
    {
        id: "3",
        nome: "Tênis Nike Air Jordan 1 Low SE",
        preco: 1199.90,
        desconto: "10% off",
        imagem: "https://olies-ports.s3.us-east-1.amazonaws.com/img/produto-categoria3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4TXNOVP6W%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T215825Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIBoWvQzm8c7JkacnDv7Wx%2BTLfrbtjzFU%2FHpujKQXFtOkAiEAlzthGb4hwv0S6tk3UI4Ujxt7t%2FevBU%2BkqAGTs0%2Bg7MYqgwMINxAAGgw2NzEwNTQ0OTczMzciDCcefbM2guPL0mK%2FISrgAvPxSeSsrJL8lPF5TigLbd3%2B%2BBFnFrKeeNfn3L%2F65UCEmJjLDEKTtwjwepXK9OSXwh3OI9CKpAhIWEMWwQr8LK9JZ5UMMsTjqHbmB3WfjKLAXPnFYx83Pu6O7AqfjvEKIMP41GxvtFisdWq3zcQRBgBjbu%2BZvW53mpkjXa3KaX%2FxlhgVrvxJVQjXUoDPyt6CTr31v9DYF9htg9kY%2FYLMRTG8lRV9VrXRKUzZ8B6einBAcA32c0z0n5OIcb%2B77OdeiF59XFXaA95XwYthGsMasoPeBWpPkuoeHymPtwznv0cqS6SIigNS8tXkKP%2F%2BF7%2B4fI4V9OlnpVNKIhTH%2FOJkgqZbm36WeN%2BHD9rj8ePHAxceQQ%2FW%2B15J%2F%2F%2FnxhiEGk7VInWXxYfJEj5%2FzGQWOfa5BztS8%2FTjGQV9gQEbkpEj09k%2FnjkDJwgkYmRIB7rodNv0jgkyGQoRcwFT8G%2F%2FV4QXToEwgNzkxwY6hwJHFpuIv5yVB3UQloUHhGyghDHQjwK%2B%2BmccOg2aXJgCNv4OKI51yAe5%2FNL9jN2jr21c9X%2FQREXTkeg40GEheNhntmKORSxyhGjy%2F4bXnecNPVbtdUw%2B60YwquZM34s9IjfB%2B11rXu31CJTYDbfpy04OhGbVyejCGXg%2FX%2F4Jo%2Bog8R6%2FzGxTCm6z3f8L8wEQRr0qkbzX09UPq3iT9I%2FKgbKiklDpF0GiwwkQYjaXNY%2FIlg%2FQgDH0rZYq1dETsCc8hY4kgIG38n0bQOPm7x%2Fe99P3%2FdNerPAHniuh251yLC9TujmRYL6Qximu986ozzs5q18UHeOomIAH%2BZzt2nnsG3%2FBYFteIfHXrA%3D%3D&X-Amz-Signature=88298bee005aaecebb871d7148ec37a0c0eb4890fd81a8c96ea4cd112f4e45fd&X-Amz-SignedHeaders=host&response-content-disposition=inline",
        categoria: "Masculino",
    },
    {
        id: "4",
        nome: "Calça Jordan Essential Fleece",
        preco: 349.90,
        desconto: "25% off",
        imagem: "https://olies-ports.s3.us-east-1.amazonaws.com/img/produto-categoria4.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4VRR54YLH%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T215852Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIQDYz7WGcQ5IWB39X4tYoo0lezAosZKcl3V%2FwLdBuhaeKgIgID98Plk%2BW1p0e7aEU4LQieBYvmVf7qBLNA8FtpnWhGEqgwMINxAAGgw2NzEwNTQ0OTczMzciDFs3KY5TNu5b7BAyvCrgAjbgP2CcJKPUyBSUbTnZSfyFeK0Be70kaVXqygKWd045Wh%2BX2IFhUZTUfmd%2FZlVran%2FHIhD8G7JOpIiWqpGK4Ojb%2BHi%2FCirmM8dEhHv%2Bbuyn63VDt%2Bp0HY1TboHQBaw8mLOn5Wvt8a6O0gA0XWzB7Li381yKqTVQCMHhoitnDTcAD%2FfU%2By5BoV6oC2WdjPSXULOrzxZM%2FfL8Ld1oSojflhP1YOaRNDnBiGFspMZl7DoO%2BYR0Kcm8bO335cxUAAZQb8pdM%2BTSxK%2BgqgBfDXo24DegexSqQKY3H4Ec3venxB%2FaLtsjRoQAdI7dGr7W72Fkpr%2BX3BeQmMUonFKh7YBFZhrwtO3slkSAx3mBsbQbXxmmuy0h%2F0pLy%2FUfSYhLuLZOPqg8rmMaXcUPG19%2F0FKcdPLtqKLrZgmyaq6AUguTU4OVCEnXsupoahdSFYNSepHHvrSbUy2OHFnIMs0T0qxrJxswgNzkxwY6hwI5y5cXqhB05WVKi0MZfSMYsVTGVK7f9lmMTM1nqzT9YytnE%2B2eOQZCLuaoZZ57qeEyMg8XHe3HGv1FQQBE%2F41rp3Lx8FJjHLWJ0LVxQ3RLScgtZlUWLD0tOLhHySV4fuIoUVS6%2F5x8e%2FrCrwG3m%2FWRXeXmLNUfrNZDQENaVBr2wTVvpTbk0627nnhi1QX7g9Z6kmSpF1sm1Pv5dot0OBCfkh%2F1MmqSZioDknQ9EabEl3HuwyflLvsHzk3CIuCXC%2FdR45Mm7349OqhsVAtl7ZdWNOd4rAsIcYk1UraybqzhPafgv6mkuv9wb8kDuekcTNgffWLtnAEyADaV6xnGMcVeyo5BYwxSTw%3D%3D&X-Amz-Signature=34e58c5ecfa10671939c46f3dd609dc16a7beb52d2d0beb792df8e9c2d9fa00b&X-Amz-SignedHeaders=host&response-content-disposition=inline",
        categoria: "Masculino",
    },

    // Feminino
    {
        id: "5",
        nome: "Tênis Nike Killshot 2",
        preco: 599.90,
        desconto: "10% off",
        imagem: "https://olies-ports.s3.us-east-1.amazonaws.com/img/produto-categoria5.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4WXU3TOFB%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T215916Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJGMEQCIGZxZ2ydIug22OeMFuCLOou8oipZG8e2KUOgPoEQFfodAiA1Ka%2BWCVkE9%2FaAnkevX402lbveM4NtiXrSbyMPpj1LFiqDAwg3EAAaDDY3MTA1NDQ5NzMzNyIMhaq9BK2J8gPTeRHcKuACI%2BAixWCJiA0cuNkfgV11eQVn2XApZ3wGkdIRqkqDCBg5Z0e%2BTnorqXqbC7G98I5n%2FA8fdo89jmI%2BtNZ0gcnTmFKBie2SDZwM9LBURos4zwjTCGiKe%2BJWNmUlz9hWXgcRCYEobANYJMVXb6JZ%2FtRc4edjxStoRjqEPCJdjx5dIREFZ4IeyQgk6%2B2IumAmIF4SEDz0myYNkSRuxGfKLSaagmgDsAaQZeqGx9G1bAmAsFNwtzNbUrops%2B9iFiBIcGl0YKmVY0ir6TqFxzTOHChWkzac%2F9jD0QRAu8Q4bSGXU6LKioWDtq7b%2BCD9klkJM5DRX0dN%2BTNJNKZR56JjxLDQDnr66TIKuF6ZL5lY4M2j7NKxFDJ9eQyKzCHJdoMdqt6%2FyEjXuWSQ8urPBqZFQ54FTKbmViE%2BjRAio6qPh%2FkDq7NvThh%2BkZJsXbG2rn2hqGOklWVCM745o%2FBxcHkgESOxTzCA3OTHBjqIAkwFeH5Q3qCQKgALMn1Q296p4uD2n4IyOLpS8qUaE0wViMDCNDoS7mKBlAQpMe%2BXxcY7XjKXhFTtdwoRREFm3Zd89kPywi9a%2FiLd7yHQVmT8T4nKsqDnztbLEd2c967VrKm001eTwrbJZfVpe1dBjEX3KOFa1sdfXWIRf%2BHL50aitczTJslXJv2C063v%2BzKGZFFhwiHqvkXtgsOmRXMdT4yMa7DyGu20ac2gZv57tGsyI84899kiWB%2FlPvFjp3rZ6ZBlVAFTmbgoVBDqISjEvGCGMX98JjoH9uBNcSUx9d7OR4wrr%2BC8Cf5IWRwcLv9FsQirVIVTtsXl9raDn96GGgt%2B8jNqtrKGWQ%3D%3D&X-Amz-Signature=40333434ffa83f9f1cf5104acf36ac312d508a2312802f4c764c8bba2a283a16&X-Amz-SignedHeaders=host&response-content-disposition=inline",
        categoria: "Feminino",
    },
    {
        id: "6",
        nome: "Tênis Superstar XLG",
        preco: 599.99,
        desconto: "",
        imagem: "https://olies-ports.s3.us-east-1.amazonaws.com/img/produto-categoria6.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY46Z7CGRG3%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T215948Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJIMEYCIQC8lAFF3Fo3dtQufjobfy6MRAkgJvjxkgxnCb%2B0WX3kaQIhAMWTk6tY4O12CoPNYKgnKv7uHmTZwGERc9DGDMml1QIuKoMDCDcQABoMNjcxMDU0NDk3MzM3IgySDSp0H6BT8ziCNrgq4AK7QyEGbEbcJ5OjQEMcSJd4oveOozGyVEtnV6%2FD8pu%2F5Z5n1JRxmFMjndPe4NlXn4nSGscTJcnAnRKHMdPbhq8hpCegtLrvsJBodJtRHcGVIjw%2BZsIVDvEOtpMdetvp%2FLYxrYqBQiiWsF0HjFUUdUgUIosFS7BISBKsj18e6e9kB2R0GtH6SLfA9%2FyT%2BSnG1RQL2ranTeVPpCbLJKhi%2B1QiOyHKNjdr%2BKu2BeY8H390LWnh7oQM%2BdRh6qG%2FSbJ6XlH3aPwFbtBYrDPxoapAVHBhaqP%2F44eqahWpUB8gGLkMP%2F8TjcEP4s6WEQYoDBJPvyyqbtMgSWP%2F0XpZILjTlCmarhjE%2FfdDoLwyjWlW2ROyER3IfSnG2HFxgx8PGUyA5bPXJgJqk8SNuOW5BGA7Nzfm%2Fi%2BulcnaxClE1BeYNkn0ISvhslSxE4BHkXb2iGte0Xd1jwu4stf2M8XSjUI%2FjpYbMIDc5McGOoYClb2MsBt3ge%2Fycphx3U79LISip0yq2gO1kNBqdKHIkxxruouBRNa4SvdVMniM%2B6%2FQmRWu5GfveIl%2FNIUWYSMwcXtQPF4ZBDnxCOI20b%2BKEnBI5b3sHlALJhWqtCmLskpki3qhqqyijXCiFYvHE9rWtHRA0PDWOZsLQ0MGloTlDJmd2uRlggzMT2ZKAcJZ45KLU509hTwiWWA%2F356iOoOmCkBtpD06MSQxkdInBzqU7wuIJ7wv44kK38SqH9X6Np%2BwyCXFBzZ6%2Bc6OwfJSzLU6GXfzTRnEyV2TvElM0X%2B3AQla8JDq9lx5%2BW%2BEPHFFkUyXzSig1VUMVp7%2F9E8C9iJGWWMXphBLPg%3D%3D&X-Amz-Signature=5ece0c880a96388904a17a2d66dcd58eabe4fc7acff2c8b3e8a41031322d9a1a&X-Amz-SignedHeaders=host&response-content-disposition=inline",
        categoria: "Feminino",
    },
    {
        id: "7",
        nome: "Tênis Nike Air Force 1 '07",
        preco: 799.90,
        desconto: "",
        imagem: "https://olies-ports.s3.us-east-1.amazonaws.com/img/produto-categoria7.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4SBWKH6EK%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T220026Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJGMEQCIHsSs2Tc7dtJctOYNzngPdGhAFEaL8Knv6CnEy1HDeQUAiA4F%2Fefb2SVkiF2UoFWDZo09weQ%2FAhv2C3lrBYYDUy9giqDAwg3EAAaDDY3MTA1NDQ5NzMzNyIMaxFwcjm4Y%2Bx%2BvchbKuACGloWdqzHW4xMbsYb3rYya8BJin%2F8duMRdM9LpnSE5uT%2Bkkf85ISdI7Pq%2FdL7OEB%2BeKruUKSKaQOUUbCphkAb9QDkc1KK80r4d36JKV0mSOdBwWYW2QnX3ASx23UYu6Tp1N16HyvQmRlJ1bJuv%2BuA%2BhSHvPGTaa5WuDvzhCgJeUKV3sQ878b4f2Ojo9Jiwq59cHqhh9cEiEXM5Dk6Gewf9feP7kxDs9px8%2BP%2Fh64Ygg9IfsqviVhhHRxbkVofGiQ82EOjBr1XEzM9PD0OEh2YryjXJSqub3%2Fi53GRpdXZyE8NS0XAlXMNLlJNWqcbyz3fwHlVhNHoV%2B30TJqSKRls4F7NPCbqbD05y%2F1WskUT%2BoZy7bZL%2BOQAFywQwZ0%2FFeJ420n8pw1eQ6cC1vaOUREO8AsrDZIc4Mj5by9P8rlWrHQfuv%2B6GWQKAtBXgOICVg0ERtcrcD0Py51Hv%2FUnqAxJyjCA3OTHBjqIAsMW0cB09GybTsNrTZVGsmD9Sc9LzBIk20%2BlOzGfqZGjaxcNhbUIVun1ZNX9baxDfYVY9u6%2FkK2xqEbVu59RCeevNoNkR5mRsHwG0DkT20DmwuSOn3biXS48eH9xQ7KOy0g4WUfVOPCuWHgyWlRrJ%2Fe99r2uTOWkPcv%2Ba9fvcaloc9ug6teQBAC7yteiWfoVMRwtrT6bOKrYHgtRpDPlb9XkkkSMQZoHZgSMw4v6lxLGTcP%2Fz%2F49vTTi7lzs%2BKouvzRYa%2F6MTauqTNL8XBkIlsl4UqV6a6WjWJxwA6Mjlj3Ac3es4Nqz36YqZip9prvvAEZurRd0X4YWqRuG9ZxI92CZmTq3nMs1Jw%3D%3D&X-Amz-Signature=21984a7fb4d7aca3e4b2a0c0420312e875fec94a4a707025f6adc4368599d3bf&X-Amz-SignedHeaders=host&response-content-disposition=inline",
        categoria: "Feminino",
    },

    // Unissex
    {
        id: "8",
        nome: "Tênis Nike Air Force 1 '07",
        preco: 479.90,
        desconto: "10% off",
        imagem: "https://olies-ports.s3.us-east-1.amazonaws.com/img/produto-categoria8.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZYPPXAY4ZABIJU4J%2F20251022%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251022T220048Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEH4aCXVzLWVhc3QtMSJHMEUCIQDLdOlfWlDhnQa9X2AX%2FcfZhlc7zaX3PEBAgSvdcnqm9gIgTRas7lelKw3W%2FsyqkQTCuXJPodviC1v3o5KR5qN%2FQm8qgwMINxAAGgw2NzEwNTQ0OTczMzciDOgewKMYZkLt0PmQ0SrgAr%2FdkRkNXDWlJc43G7u%2FrKgyc068Iya8egWK7ZPXCoSOXtGv%2FzPoNZcchf36trcMmijmBmwx8s2m6nlIzs0mYw07Wse%2B1ckU6HPRy%2BOi4VrDRww4RExUFdFO1QfTHs0MCX8BIKxsi%2BtlKbRP2u8sftnGsSrqo2T5toblGfYuDwrHWVvjiM9WA8U4vu%2FagdyfKm6VEq3NuIXpR9EZk4xvYaeXSgMbiR5vZ2hEuCJkg%2FrkgaAqSkcRDf0QL4CdotpRRv%2BAv%2BV8IojNkz65XgyA3lxXzrHaiFjOZU7dA6voSK9clDtBUh%2Bs%2FbE63jYiKKtx7j6qbLpCHI5B6sXSoqh8%2FlhceIF0su%2Bf5ChFAl5wl2zBoZ%2FAKtwpFY3je%2BNxsiO4qLdO9XLeuNSMPnMA5aPdJfctNhJ6Ppc1WHF5SH3s4vgybq8Nm%2Fvst4Zf%2F07co8VuIz%2FDgU6Mwb45QaDszd6PM0owgNzkxwY6hwLH522OlUh5V5KdRkx0Nw46kQWu2H7CyyYCZCeeWYSD0N4bGNqae%2By9vwyE3WKMy1yo54Xo07Iveb5Ox1xR1HDiPPOidafWsXMLUD3RtW%2F70SIrQghpm5v%2BaNYrpt7ztwsXL%2B%2FxmWrVBKbPOf8NOkngAmoTtkxuBcWsmu2%2B%2B%2B%2FSDEQMTIWoF3PG2jY%2F9sqOuJEzsQfsqVeoHcDRBLxR1OG%2BylQXxgMikc4Evdjj3tLHZ%2FIe%2BdoMDDZYLOqoxOxfHaUEwHXKGtsjhoTp3A2gVbaRknQy4licY1uEXJICtp6RX1VAB6r%2F6A%2BesY8VzCi7yo2p5EPDwmpsr6EGegiTMpxP1ey9tYi2CQ%3D%3D&X-Amz-Signature=010973e59019be94250baef00640efd7f27a0ca8f90ba9f402f0713d7eb634ea&X-Amz-SignedHeaders=host&response-content-disposition=inline",
        categoria: "Unissex",
    },
];

export default function Produtos() {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoria } = route.params;

  const [filtroAberto, setFiltroAberto] = useState(false);
  const [filtroSelecionado, setFiltroSelecionado] = useState("Todos");
  const [precoMin, setPrecoMin] = useState("");
  const [precoMax, setPrecoMax] = useState("");

  // Filtragem base pela categoria (inclui Unissex para masculino e feminino)
  const filtrados = produtos.filter((p) => {
    if (categoria === "Masculino" || categoria === "Feminino") {
      return p.categoria === categoria || p.categoria === "Unissex";
    }
    return p.categoria === categoria;
  });

  // Aplicar filtros adicionais
  const filtradosComFiltro = filtrados.filter((p) => {
    const precoValido =
      (!precoMin || p.preco >= parseFloat(precoMin)) &&
      (!precoMax || p.preco <= parseFloat(precoMax));

    if (filtroSelecionado === "Todos") return precoValido;
    if (filtroSelecionado === "Promocao")
      return p.desconto !== "" && precoValido;
    return precoValido;
  });

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("InfoProduto", { produto: item })}
    >
      <Image
        source={
          typeof item.imagem === "string"
            ? { uri: item.imagem }
            : item.imagem 
        }
        style={styles.imagem}
        resizeMode="contain"
      />
      <View style={styles.info}>
        <Text style={styles.preco}>R$ {item.preco.toFixed(2)}</Text>
        {item.desconto ? (
          <Text style={styles.desconto}>{item.desconto}</Text>
        ) : null}
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.categoria}>{item.categoria}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header com botão de filtro */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => setFiltroAberto(true)}
          style={styles.filtroBotao}
        >
          <Ionicons name="filter-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtradosComFiltro}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
        columnWrapperStyle={styles.coluna}
      />

      {/* Modal de filtro */}
      <Modal visible={filtroAberto} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setFiltroAberto(false)}
          activeOpacity={1}
        >
          <Animated.View style={styles.filtroContainer}>
            <Text style={styles.filtroTitulo}>Filtrar por:</Text>

            <TouchableOpacity
              style={[
                styles.opcao,
                filtroSelecionado === "Todos" && styles.opcaoAtiva,
              ]}
              onPress={() => setFiltroSelecionado("Todos")}
            >
              <Text style={styles.textoOpcao}>Todos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.opcao,
                filtroSelecionado === "Promocao" && styles.opcaoAtiva,
              ]}
              onPress={() => setFiltroSelecionado("Promocao")}
            >
              <Text style={styles.textoOpcao}>Em promoção</Text>
            </TouchableOpacity>

            {/* Filtro por preço */}
            <View style={{ marginTop: 20 }}>
              <Text style={styles.filtroSubtitulo}>Preço mínimo:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex: 100"
                value={precoMin}
                onChangeText={setPrecoMin}
              />
              <Text style={styles.filtroSubtitulo}>Preço máximo:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Ex: 1000"
                value={precoMax}
                onChangeText={setPrecoMax}
              />
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5efe5" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  titulo: { fontSize: 22, fontWeight: "bold", color: "#052242" },

  filtroBotao: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  lista: {
    paddingHorizontal: 10,
    paddingBottom: 40,
    paddingTop: 20,
  },

  coluna: {
    justifyContent: "space-between",
  },

  card: {
    backgroundColor: "#fff",
    flex: 0.47,
    marginBottom: 40,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  imagem: {
    width: "100%",
    height: 140,
    marginBottom: 8,
  },

  info: { paddingHorizontal: 4 },
  preco: { fontWeight: "bold", fontSize: 14, color: "#000" },
  desconto: { color: "#009900", fontWeight: "600", fontSize: 13 },
  nome: { color: "#333", fontSize: 13, marginTop: 4, fontWeight: "500" },
  categoria: { color: "#777", fontSize: 12, marginTop: 2 },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  filtroContainer: {
    backgroundColor: "#fff",
    width: width * 0.7,
    height: "100%",
    position: "absolute",
    right: 0,
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  filtroTitulo: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  filtroSubtitulo: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },

  opcao: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  opcaoAtiva: { backgroundColor: "#e6f3ff" },

  textoOpcao: { fontSize: 16, color: "#052242" },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
  },
});
