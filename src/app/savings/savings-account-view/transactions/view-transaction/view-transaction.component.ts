/** Angular Imports */
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

/** Custom Services */
import { SavingsService } from 'app/savings/savings.service';
import { SettingsService } from 'app/settings/settings.service';

/** Custom Dialogs */
import { UndoTransactionDialogComponent } from '../../custom-dialogs/undo-transaction-dialog/undo-transaction-dialog.component';
import { Dates } from 'app/core/utils/dates';
import { ReleaseAmountDialogComponent } from '../../custom-dialogs/release-amount-dialog/release-amount-dialog.component';

/**
 * View Transaction Component.
 * TODO: Add support for account transfers.
 */
@Component({
  selector: 'mifosx-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.scss']
})
export class ViewTransactionComponent {

  /** Transaction data. */
  transactionData: any;

  accountId: string;

  /**
   * Retrieves the Transaction data from `resolve`.
   * @param {SavingsService} savingsService Savings Service
   * @param {ActivatedRoute} route Activated Route.
   * @param {Router} router Router for navigation.
   * @param {MatDialog} dialog Dialog reference.
   * @param {Dates} dateUtils Date Utils.
   * @param {SettingsService} settingsService Setting service
   */
  constructor(private savingsService: SavingsService,
              private route: ActivatedRoute,
              private dateUtils: Dates,
              private router: Router,
              public dialog: MatDialog,
              private settingsService: SettingsService) {
    this.route.data.subscribe((data: { savingsAccountTransaction: any }) => {
      this.accountId = this.route.parent.snapshot.params['savingAccountId'];
      this.transactionData = data.savingsAccountTransaction;
      console.log(this.transactionData);
    });
  }

  /**
   * Undo the savings transaction
   */
  undoTransaction() {
    const undoTransactionAccountDialogRef = this.dialog.open(UndoTransactionDialogComponent);
    undoTransactionAccountDialogRef.afterClosed().subscribe((response: any) => {
      if (response.confirm) {
        const locale = this.settingsService.language.code;
        const dateFormat = this.settingsService.dateFormat;
        const data = {
          transactionDate: this.dateUtils.formatDate(this.transactionData.date && new Date(this.transactionData.date), dateFormat),
          transactionAmount: 0,
          dateFormat,
          locale
        };
        this.savingsService.executeSavingsAccountTransactionsCommand(this.accountId, 'undo', data, this.transactionData.id).subscribe(() => {
          this.router.navigate(['../'], { relativeTo: this.route });
        });
      }
    });
  }

  releaseAmount() {
    const releaseAmountDialogRef = this.dialog.open(ReleaseAmountDialogComponent);
    releaseAmountDialogRef.afterClosed().subscribe((response: any) => {
      if (response.confirm) {
        const data = { };
        this.savingsService.executeSavingsAccountTransactionsCommand(this.accountId, 'releaseAmount', data, this.transactionData.id).subscribe(() => {
          this.router.navigate(['../'], { relativeTo: this.route });
        });
      }
    });
  }

}
