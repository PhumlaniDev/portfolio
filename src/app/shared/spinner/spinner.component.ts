import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoadingService } from '../../service/spinner/loading.service';

@Component({
  standalone: true,
  selector: 'app-spinner',
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  constructor(public loadingService: LoadingService) {}
}
