import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})

export class OrderHistoryComponent implements OnInit {
  
  orderHistory: OrderHistory[] = [];
  storage: Storage = sessionStorage;
  emailKey: string = 'userEmail';

  constructor(private orderHistoryService: OrderHistoryService) {}

  ngOnInit(): void {
    this.handleOrderHistory();
  }
  
  handleOrderHistory() {
    const email = JSON.parse(this.storage.getItem(this.emailKey)!);
    console.log("calling history service");
    this.orderHistoryService.getOrderHistory(email).subscribe(
      data => {
        console.log("data" + data._embedded.orders);
        this.orderHistory = data._embedded.orders;
      }
    )
  }

}
