import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Song } from 'src/app/services/data-types/common.type';
import { RecordVal } from 'src/app/services/data-types/member.type';
import { RecordType } from 'src/app/services/member.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecordsComponent implements OnInit {


  @Input() records: RecordVal[];
  @Input() recordType =  RecordType.weekData;
  @Input() listenSongs;
  @Input() currentIndex = -1;

  @Output() onChangeType = new EventEmitter<RecordType>();
  @Output() onAddSong = new EventEmitter<[Song, boolean]>();


  constructor() { }

  ngOnInit(): void {



  }

}
