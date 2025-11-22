import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-install-pwa-button',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule],
  template: `
    <!-- Bouton fixe en bas (seulement sur mobile) -->
    <div class="install-banner" *ngIf="showInstallButton && !isStandalone">
      <div class="install-content">
        <span class="install-text">
          <i class="pi pi-download mr-2"></i>
          Installe l'application famille sur ton téléphone
        </span>
        <p-button 
          label="Installer" 
          icon="pi pi-download" 
          size="small"
          class="p-button-success p-button-rounded"
          (onClick)="installPWA()">
        </p-button>
        <button pButton icon="pi pi-times" class="p-button-text p-button-rounded" (click)="dismiss()"></button>
      </div>
    </div>

    <!-- Dialog iOS (car iOS ne déclenche pas beforeinstallprompt) -->
    <p-dialog 
      header="Installer l'application" 
      [(visible)]="showiOSDialog" 
      [modal]="true" 
      [style]="{ width: '90vw', maxWidth: '400px' }"
      [closable]="false">
      <div class="flex flex-column align-items-center gap-3">
        <i class="pi pi-share-alt text-4xl text-primary"></i>
        <p class="text-center">
          Pour installer l'application :<br>
          1. Clique sur le bouton <i class="pi pi-export"></i> en bas<br>
          2. Puis « Ajouter à l’écran d’accueil »
        </p>
        <p-button label="Compris" (onClick)="showiOSDialog = false" class="p-button-outlined"></p-button>
      </div>
    </p-dialog>
  `,
  styles: [`
    .install-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem;
      z-index: 9999;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
      animation: slideUp 0.5s ease-out;
    }

    .install-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 500px;
      margin: 0 auto;
      gap: 1rem;
    }

    .install-text {
      font-size: 1rem;
      font-weight: 600;
    }

    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }

    /*@media (min-width: 769px) {
      .install-banner { display: none; }
    }*/
  `]
})
export class InstallPwaButtonComponent implements OnInit {
  deferredPrompt: any;
  showInstallButton = false;
  showiOSDialog = false;
  isStandalone = false;

  ngOnInit() {
    this.isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                          || (window.navigator as any).standalone === true;

    if (this.isStandalone) return;

    // Android / Chrome
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton = true;
    });

    // iOS detection
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isInStandaloneMode = (window.navigator as any).standalone === true;
    
    if (isIOS && !isInStandaloneMode && !localStorage.getItem('pwa_dismissed')) {
      setTimeout(() => this.showiOSDialog = true, 3000);
    }
  }

  async installPWA() {
    if (!this.deferredPrompt) return;

    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then((choice: any) => {
      if (choice.outcome === 'accepted') {
        this.showInstallButton = false;
      }
      this.deferredPrompt = null;
    });
  }

  dismiss() {
    this.showInstallButton = false;
    localStorage.setItem('pwa_dismissed', 'true');
  }
}